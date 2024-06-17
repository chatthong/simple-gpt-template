import React, { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

const ChatInput = ({ onSend }) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', marginTop: '10px' }}>
      <Input
        clearable
        fullWidth
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' ? handleSend() : null}
      />
      <Button auto onPress={handleSend}>Send</Button>
    </div>
  );
};

export default ChatInput;
