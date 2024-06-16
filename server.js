require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/api/avatar/:seed', (req, res) => {
    const seed = req.params.seed;
    const filePath = path.resolve(`./images/${seed}.jpg`);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).json({ error: 'Avatar not found' });
    }
});

app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        console.log('Image uploaded:', imageUrl);
        res.json({ url: imageUrl });
    } else {
        res.status(400).json({ error: 'No file uploaded' });
    }
});

async function fetchChatCompletion(messages, retries = 5) {
    try {
        const response = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: messages,
            max_tokens: 1000, // Adjust this as needed
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });
        return response.data.choices[0].message.content;
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            console.warn(`Rate limit hit, retrying... (${retries} retries left)`);
            await new Promise(resolve => setTimeout(resolve, 2000 * (5 - retries))); // Exponential backoff
            return fetchChatCompletion(messages, retries - 1);
        } else {
            throw error;
        }
    }
}

app.post('/api/chat', upload.none(), async (req, res) => {
    console.log('Received chat request');
    let conversation;
    try {
        conversation = JSON.parse(req.body.conversation);
    } catch (error) {
        console.error('Invalid conversation format:', error);
        return res.status(400).json({ error: 'Invalid conversation format' });
    }

    // Prepare the conversation for API request
    const messages = [
        {
            role: "system",
            content: process.env.MASTER_PROMPT
        },
        {
            role: "user",
            content: "สวัสดีครับ"
        },
        {
            role: "assistant",
            content: "สวัสดีครับคุณลูกค้า แอดมินครับ ไม่ทราบว่าคุณลูกค้ากำลังปลูกอะไรอยู่ครับ? หรือมีสินค้าตัวไหนสนใจเป็นพิเศษครับ? 😊"
        }
    ].concat(conversation);

    console.log('Formatted messages for OpenAI:', messages);

    let botReply = "I can only respond to text messages at the moment.";

    try {
        botReply = await fetchChatCompletion(messages);
        console.log('Received reply from OpenAI:', botReply);
    } catch (error) {
        console.error("Error occurred:", error);
        if (error.response) {
            console.error("API response error:", error.response.data);
        }
        botReply = 'An error occurred while processing your request.';
    }

    res.json({ reply: botReply });
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
