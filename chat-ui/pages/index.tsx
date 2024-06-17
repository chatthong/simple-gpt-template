import {
  Card,
  Grid,
  Text,
  Link,
  Input,
  Spacer,
  Button,
} from "@nextui-org/react";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Grid.Container gap={2} justify="center" style={{ height: "100vh" }}>
        {/* Chat Tabs on the left */}
        <Grid xs={2} direction="column" gap={2}>
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
        </Grid>

        {/* Chat Box on the right */}
        <Grid xs={10} direction="column" gap={2}>
          <Card>
            <Card.Header>
              <Text h3>ChatGPT</Text>
            </Card.Header>
            <Card.Body style={{ flex: 1 }}>
              <Text>This is a chat message.</Text>
              {/* Add more chat messages here */}
            </Card.Body>
            <Card.Footer>
              <Grid.Container gap={2} alignItems="center">
                <Grid xs>
                  <Input
                    clearable
                    fullWidth
                    size="lg"
                    placeholder="Type a message"
                  />
                </Grid>
                <Grid>
                  <Button auto>Send</Button>
                </Grid>
              </Grid.Container>
            </Card.Footer>
          </Card>
        </Grid>
      </Grid.Container>
    </DefaultLayout>
  );
}
