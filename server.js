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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    let additionalContext = '';
    if (imagePath) {
      const imageUrl = `http://143.198.223.202:${port}/uploads/${req.file.filename}`;
      additionalContext = ` Here is the image: ${imageUrl}.`;
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

    // Clean up the uploaded image after processing
    if (imagePath) {
      fs.unlinkSync(imagePath);
    }
  } catch (error) {
    console.error("Error occurred:", error.response ? error.response.data : error.message);
    botReply = 'An error occurred while processing your request.';
  }

  res.json({ reply: botReply });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://143.198.223.202:${port}`);
});
