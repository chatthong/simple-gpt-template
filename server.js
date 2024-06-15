
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const OpenAI = require('openai');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/chat', upload.single('image'), async (req, res) => {
  const userMessage = req.body.message;
  const imagePath = req.file ? req.file.path : null;

  let botReply = "I can only respond to text messages at the moment.";

  try {
    if (userMessage) {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: 'user', content: userMessage }],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      botReply = response.choices[0].message.content;
    }
    // Optionally, handle image input here
    // if (imagePath) {
    //   // Process the image as needed
    // }
  } catch (error) {
    console.error(error);
    botReply = 'An error occurred while processing your request.';
  }

  res.json({ reply: botReply });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
