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
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'images')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, uniqueSuffix + extension);
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
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    // Generate a URL for the uploaded file
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

app.post('/api/chat', upload.none(), async (req, res) => {
    console.log('Received chat request');
    let conversation;
    try {
        conversation = JSON.parse(req.body.conversation);
    } catch (error) {
        console.error('Invalid conversation format:', error);
        return res.status(400).json({ error: 'Invalid conversation format' });
    }

    let botReply = "I can only respond to text messages at the moment.";

    try {
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

        console.log('Sending messages to OpenAI:', JSON.stringify(messages, null, 2)); // Log the messages sent to OpenAI

        const response = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: messages,
            max_tokens: 2000,
            temperature: 1,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        botReply = response.data.choices[0].message.content;
        console.log('Received reply from OpenAI:', JSON.stringify(response.data, null, 2)); // Log the JSON response from OpenAI
    } catch (error) {
        console.error("Error occurred:", error);
        if (error.response) {
            console.error("API response error:", error.response.data);
        }
        botReply = 'An error occurred while processing your request.';
    }

    res.json({ reply: botReply });
});

// Serve the React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
