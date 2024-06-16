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
    res.status(404).send('Avatar not found');
  }
});

app.post('/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } else {
    res.status(400).send('No file uploaded.');
  }
});

app.post('/api/chat', async (req, res) => {
  console.log('Received chat request');
  let conversation;
  try {
    conversation = JSON.parse(req.body.conversation);
  } catch (error) {
    return res.status(400).send('Invalid conversation format.');
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
      },
      {
        role: "user",
        content: "{{generate1}}"
      }
    ].concat(conversation);

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    botReply = response.data.choices[0].message.content;
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
