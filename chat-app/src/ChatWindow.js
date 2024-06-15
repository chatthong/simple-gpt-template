// ChatWindow.js
import React, { useState } from 'react';

const ChatWindow = ({ chat, sendMessage }) => {
  const [inputValue, setInputValue] = useState('');
  const [image, setImage] = useState(null);

  const handleSendMessage = async () => {
    if (inputValue.trim() || image) {
      if (inputValue.trim()) {
        sendMessage(chat.id, { type: 'text', content: inputValue });
        setInputValue('');
      }
      if (image) {
        const formData = new FormData();
        formData.append('conversation', JSON.stringify([{ role: 'user', content: inputValue }]));
        formData.append('image', image);

        const response = await fetch('/api/chat', {
          method: 'POST',
          body: formData
        });

        const data = await response.json();
        sendMessage(chat.id, { type: 'bot', content: data.reply });
        setImage(null);
      }
    }
  };

  return (
    <div className="chat-window p-3">
      <h5>Chat #{chat.id}</h5>
      <div className="chat-content">
        {chat.messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.type === 'text' ? 'user-message' : 'bot-message'}`}>
            {message.type === 'text' ? message.content : <img src={message.content} className="img-thumbnail" alt="thumbnail" />}
          </div>
        ))}
      </div>
      <div className="input-group mt-3">
        <input
          type="text"
          className="form-control"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
        />
        <input
          type="file"
          style={{ display: 'none' }}
          id={`image-input-${chat.id}`}
          onChange={(e) => setImage(e.target.files[0])}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-secondary"
            onClick={() => document.getElementById(`image-input-${chat.id}`).click()}
          >
            Upload
          </button>
          <button className="btn btn-primary" onClick={handleSendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
