import React from 'react';
import { Card, Text } from '@nextui-org/react';

const ChatMessage = ({ message, sender }) => {
  return (
    <Card css={{ mw: "400px", mb: "$6" }}>
      <Card.Body>
        <Text>{sender}: {message}</Text>
      </Card.Body>
    </Card>
  );
};

export default ChatMessage;
