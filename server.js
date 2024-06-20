require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "react/build")));

try {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  console.log("OpenAI configuration initialized successfully.");
} catch (error) {
  console.error("Error initializing OpenAI configuration:", error);
}

app.post("/api/chat", upload.none(), async (req, res) => {
  console.log("Received chat request");
  let conversation;
  try {
    conversation = JSON.parse(req.body.conversation);
  } catch (error) {
    console.error("Invalid conversation format:", error);
    return res.status(400).json({ error: "Invalid conversation format" });
  }

  let botReply = "I can only respond to text messages at the moment.";

  try {
    const messages = [
      {
        role: "system",
        content: process.env.MASTER_PROMPT,
      },
      {
        role: "user",
        content: "สวัสดีครับ",
      },
      {
        role: "assistant",
        content:
          "สวัสดีครับคุณลูกค้า แอดมินครับ ไม่ทราบว่าคุณลูกค้ากำลังปลูกอะไรอยู่ครับ? หรือมีสินค้าตัวไหนสนใจเป็นพิเศษครับ? 😊",
      },
    ].concat(conversation);

    console.log(
      "Sending messages to OpenAI:",
      JSON.stringify(messages, null, 2)
    ); // Log the messages sent to OpenAI

    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 2000,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    botReply = response.data.choices[0].message.content;
    console.log(
      "Received reply from OpenAI:",
      JSON.stringify(response.data, null, 2)
    ); // Log the JSON response from OpenAI
  } catch (error) {
    console.error("Error occurred:", error);
    if (error.response) {
      console.error("API response error:", error.response.data);
    }
    botReply = "An error occurred while processing your request.";
  }

  res.json({ reply: botReply });
});

// Serve the React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "react/build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${port}`);
});
