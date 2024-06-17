import React, { useState } from 'react';
import { Container } from '@nextui-org/react';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatContainer = () => {
  const [messages, setMessages] = useState([]);

  const handleSend = (message) => {
    setMessages([...messages, { sender: 'User', message }]);
    // Simulate a bot response
    setTimeout(() => {
      setMessages(prevMessages => [...prevMessages, { sender: 'Bot', message: 'Hello! How can I help you?' }]);
    }, 1000);
  };

  return (
    <Container>
      {messages.map((msg, index) => (
        <ChatMessage key={index} sender={msg.sender} message={msg.message} />
      ))}
      <ChatInput onSend={handleSend} />
    </Container>
  );
};

export default ChatContainer;
