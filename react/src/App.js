import React, { useState } from 'react';
import { NextUIProvider, Container, Grid, Card, Text, Button } from '@nextui-org/react';
import ChatContainer from './components/ChatContainer';

const App = () => {
  const [activeTab, setActiveTab] = useState('chat1');

  return (
    <NextUIProvider>
      <Container css={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Grid.Container gap={2}>
          <Grid xs={8}>
            <Card>
              <Card.Body>
                <ChatContainer />
              </Card.Body>
            </Card>
          </Grid>
          <Grid xs={4}>
            <Card>
              <Card.Header>
                <Button.Group>
                  <Button onPress={() => setActiveTab('chat1')} flat={activeTab !== 'chat1'}>Chat 1</Button>
                  <Button onPress={() => setActiveTab('chat2')} flat={activeTab !== 'chat2'}>Chat 2</Button>
                  <Button onPress={() => setActiveTab('chat3')} flat={activeTab !== 'chat3'}>Chat 3</Button>
                </Button.Group>
              </Card.Header>
              <Card.Body>
                {activeTab === 'chat1' && <Text>Chat 1 content</Text>}
                {activeTab === 'chat2' && <Text>Chat 2 content</Text>}
                {activeTab === 'chat3' && <Text>Chat 3 content</Text>}
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Container>
    </NextUIProvider>
  );
};

export default App;
