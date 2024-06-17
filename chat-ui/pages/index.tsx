import { Card, Row, Col, Text, Link, Input, Spacer, Button } from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Row justify="center" align="center" style={{ height: "100vh" }}>
        {/* Chat Tabs on the left */}
        <Col span={2} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card clickable>
            <Card.Body>
              <Text h4>Chat 1</Text>
            </Card.Body>
          </Card>
          <Card clickable>
            <Card.Body>
              <Text h4>Chat 2</Text>
            </Card.Body>
          </Card>
          <Card clickable>
            <Card.Body>
              <Text h4>Chat 3</Text>
            </Card.Body>
          </Card>
        </Col>

        {/* Chat Box on the right */}
        <Col span={10} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Card>
            <Card.Header>
              <Text h3>ChatGPT</Text>
            </Card.Header>
            <Card.Body style={{ flex: 1 }}>
              <Text>This is a chat message.</Text>
              {/* Add more chat messages here */}
            </Card.Body>
            <Card.Footer>
              <Row align="center">
                <Col>
                  <Input clearable fullWidth size="lg" placeholder="Type a message" />
                </Col>
                <Col auto>
                  <Button auto>Send</Button>
                </Col>
              </Row>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </DefaultLayout>
  );
}
