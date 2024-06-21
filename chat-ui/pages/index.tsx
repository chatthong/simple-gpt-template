import React, { useState } from "react";
import OpenAI from "openai";
import {
  Avatar,
  Button,
  Kbd,
  Textarea,
  Tabs,
  Tab,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { CameraIcon } from "@/components/icons";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";

const initialMessages = [
  { role: "system", content: process.env.MASTER_PROMPT || "System prompt" },
  { role: "user", content: "สวัสดีครับ" },
  {
    role: "assistant",
    content:
      "สวัสดีครับคุณลูกค้า แอดมินครับ ไม่ทราบว่าคุณลูกค้ากำลังปลูกอะไรอยู่ครับ? หรือมีสินค้าตัวไหนสนใจเป็นพิเศษครับ? 😊",
  },
];

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

const initialChats = [{ id: 1, messages: initialMessages }];

export default function IndexPage() {
  const [textareaContent, setTextareaContent] = useState<string>("");
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      callToOpenAI();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(e.target.value);
  };
  const [chats, setChats] = useState(initialChats);
  const [description, setDescription] = useState("");

  async function callToOpenAI() {
    const userMessage = { role: "user", content: textareaContent };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setTextareaContent(""); // Clear the textarea
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [...initialMessages, ...updatedMessages],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    console.log(response.choices[0]);
    const assistantMessage = response.choices[0].message;
    setChatMessages((prevMessages) => [...prevMessages, assistantMessage]);
  }

  const handleAddTab = () => {
    const newChat = {
      id: chats.length + 1,
      messages: [{ role: "user", content: "New chat started" }],
    };
    setChats([...chats, newChat]);
  };
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className="title">Whale&nbsp;</h1>
          <h1 className="title" style={{ color: "violet" }}>
            GPT&nbsp;
          </h1>
          <br />
          <h4 className="subtitle mt-4">Beautiful, Customer Helper GPT</h4>
        </div>

        <div className="flex flex-col px-4">
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options" placement="start">
              {chats.map((chat) => (
                <Tab key={`chat${chat.id}`} title={`Chat #${chat.id}`}>
                  <Card className="w-[600px] flex">
                    <CardHeader className="flex gap-3">
                      <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-between">
                        <p className="text-md">WhaleGPT</p>
                        <div className="inline-flex justify-center">
                          <Tabs radius="full" aria-label="Tabs radius">
                            <Tab key="Creative" title="Creative" />
                            <Tab key="Formal" title="Formal" />
                          </Tabs>
                        </div>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex gap-3 ">
                      {chatMessages
                        .filter((msg) => msg.role !== "system")
                        .map((message, index) => (
                          <div
                            key={index}
                            className="relative inline-flex shrink-0"
                          >
                            <Avatar
                              radius="sm"
                              src={
                                message.role === "user"
                                  ? siteConfig.profileURLUser
                                  : siteConfig.profileURLAI
                              }
                            />
                            <p className="max-w-[530px] ml-2 text-small relative rounded-medium bg-content2 px-4 py-3 text-default-600">
                              {message.content}
                            </p>
                          </div>
                        ))}
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Textarea
                        placeholder="Type your message here"
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        className="flex"
                        value={textareaContent}
                        endContent={
                          <Kbd
                            className="hidden lg:inline-block"
                            keys={["enter"]}
                          >
                            Enter
                          </Kbd>
                        }
                        startContent={
                          <Button
                            size="sm"
                            endContent={<CameraIcon size={20} />}
                            onClick={callToOpenAI}
                          ></Button>
                        }
                      />
                    </CardFooter>
                  </Card>
                </Tab>
              ))}
            </Tabs>
          </div>
          <div className="flex mt-2">
            <Button
              isIconOnly
              radius="full"
              key="newchat"
              onClick={handleAddTab}
              size="sm"
            >
              +
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
