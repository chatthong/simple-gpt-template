require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { exec } = require('child_process');
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.get('/api/avatar/:seed', (req, res) => {
  const seed = req.params.seed;
  exec(`dicebear avatar --seed ${seed} --style fun-emoji`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send('Error generating avatar');
    }
    res.set('Content-Type', 'image/svg+xml');
    res.send(stdout);
  });
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
        content: [
          {
            type: "text",
            text: "Here is the image"
          },
          {
            type: "image_url",
            image_url: {
              url: base64Image
            }
          }
        ]
      });

      fs.unlinkSync(imagePath);
    }

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: conversation,
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
