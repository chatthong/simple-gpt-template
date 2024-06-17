import React from 'react';
import { NextUIProvider, Container } from '@nextui-org/react';
import ChatContainer from './components/ChatContainer';

const App = () => {
  return (
    <NextUIProvider>
      <Container display="flex" justify="center" alignItems="center" css={{ height: '100vh' }}>
        <ChatContainer />
      </Container>
    </NextUIProvider>
  );
};

export default App;
