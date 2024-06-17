import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Text, Input, Button, Spacer, Container } from "@nextui-org/react";
import DefaultLayout from "@/layouts/default";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <Container>
        <div className="max-w-full gap-2 grid grid-cols-12 px-8 h-screen">
          {/* Chat Tabs on the left */}
          <div className="col-span-2 flex flex-col gap-4">
            <Card clickable>
              <CardHeader>
                <Text h4>Chat 1</Text>
              </CardHeader>
            </Card>
            <Card clickable>
              <CardHeader>
                <Text h4>Chat 2</Text>
              </CardHeader>
            </Card>
            <Card clickable>
              <CardHeader>
                <Text h4>Chat 3</Text>
              </CardHeader>
            </Card>
          </div>

          {/* Chat Box on the right */}
          <div className="col-span-10 flex flex-col gap-4">
            <Card className="flex-1">
              <CardHeader>
                <Text h3>ChatGPT</Text>
              </CardHeader>
              <CardBody>
                <Text>This is a chat message.</Text>
                {/* Add more chat messages here */}
              </CardBody>
              <CardFooter>
                <div className="flex w-full gap-2">
                  <Input clearable fullWidth size="lg" placeholder="Type a message" />
                  <Button auto>Send</Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </Container>
    </DefaultLayout>
  );
}
