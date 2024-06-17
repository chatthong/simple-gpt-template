import React from 'react';
import { NextUIProvider, Container, Grid, Card, Text, Tabs, Tab } from '@nextui-org/react';
import ChatContainer from './components/ChatContainer';

const App = () => {
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
              <Card.Body>
                <Tabs initialValue="1">
                  <Tab key="1" title="Chat 1">
                    <Text>Chat 1 content</Text>
                  </Tab>
                  <Tab key="2" title="Chat 2">
                    <Text>Chat 2 content</Text>
                  </Tab>
                  <Tab key="3" title="Chat 3">
                    <Text>Chat 3 content</Text>
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          </Grid>
        </Grid.Container>
      </Container>
    </NextUIProvider>
  );
};

export default App;
