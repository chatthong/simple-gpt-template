require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const { Configuration, OpenAIApi } = require('openai');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const upload = multer({ dest: 'uploads/' });

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', upload.single('image'), async (req, res) => {
  const userMessage = req.body.message;
  const imagePath = req.file ? req.file.path : null;
  let botReply = "I can only respond to text messages at the moment.";

  try {
    if (userMessage) {
      let additionalContext = '';
      
      if (imagePath) {
        // Create a reference to the image
        additionalContext = ` The user also uploaded an image: ${imagePath}`;
        // Optionally, process the image here
        // For example, you can upload it to a storage service and get a URL
        // fs.unlinkSync(imagePath);  // Clean up the uploaded image if needed
      }

      const response = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{ role: 'user', content: userMessage + additionalContext }],
        temperature: 1,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      botReply = response.data.choices[0].message.content;
    }
  } catch (error) {
    console.error("Error occurred:", error.response ? error.response.data : error.message);
    botReply = 'An error occurred while processing your request.';
  }

  res.json({ reply: botReply });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
