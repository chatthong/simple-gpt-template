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

const upload = multer({ dest: 'uploads/' });

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

app.post('/api/chat', upload.single('image'), async (req, res) => {
  console.log('Received chat request');
  const conversation = JSON.parse(req.body.conversation);
  const imagePath = req.file ? req.file.path : null;
  let botReply = "I can only respond to text messages at the moment.";

  try {
    if (imagePath) {
      const imageData = fs.readFileSync(imagePath, { encoding: 'base64' });
      const base64Image = `data:image/jpeg;base64,${imageData}`;
      conversation.push({
        role: "user",
        content: `Here is the image: ${base64Image}`
      });

      fs.unlinkSync(imagePath);
    }

    const messages = [
      {
        role: "system",
        content: "ผู้ช่วยขายสินค้า"
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

// Serve the React app
app.use(express.static(path.join(__dirname, 'build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
