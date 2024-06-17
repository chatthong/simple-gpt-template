import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatWindow = ({ selectedChatId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (selectedChatId) {
      axios.get(`/api/messages/${selectedChatId}`)
        .then(response => {
          setMessages(response.data.messages || []);
        })
        .catch(error => {
          console.error('There was an issue fetching messages:', error);
          setMessages([]); // Ensure messages is never undefined
        });
    }
  }, [selectedChatId]);

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { content: input, sender: 'user' }]);
      setInput('');
    }
  };

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  return (
    <div className="chat-window">
      <div className="p-3 tabcontent">
        <h5>Chat #{selectedChatId}</h5>
        <div className="chat-content" id={`messages-${selectedChatId}`}>
          {messages.map((message, index) => (
            <div key={index} className={`chat-message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
              {message.content}
            </div>
          ))}
        </div>
        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            value={input}
            onChange={handleInputChange}
            placeholder="Type something..."
          />
          <div className="input-group-append">
            <button className="btn btn-primary" onClick={handleSendMessage} type="button">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
