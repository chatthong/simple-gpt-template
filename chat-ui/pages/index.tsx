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
  ScrollShadow,
} from "@nextui-org/react";
import { ThemeSwitch } from "@/components/theme-switch";

import { siteConfig } from "@/config/site";
import { CameraIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";

// Define the correct type for the messages
interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

interface Chat {
  id: number;
  messages: ChatMessage[];
}

// Initial messages for each chat
const initialMessages: ChatMessage[] = [
  { role: "system", content: process.env.MASTER_PROMPT || "System prompt" },
  { role: "user", content: "สวัสดีครับ" },
  {
    role: "assistant",
    content:
      "สวัสดีครับคุณลูกค้า แอดมินครับ ไม่ทราบว่าคุณลูกค้ากำลังปลูกอะไรอยู่ครับ? หรือมีสินค้าตัวไหนสนใจเป็นพิเศษครับ? 😊",
  },
];

// Function to validate if a text is a valid URL
const isValidURL = (text: string) => {
  try {
    new URL(text);
    return true;
  } catch (_) {
    return false;
  }
};

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

// Initial chats array with one chat containing initial messages
const initialChats: Chat[] = [{ id: 1, messages: initialMessages }];

export default function IndexPage() {
  const [textareaContent, setTextareaContent] = useState<string>("");
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(1);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  // Handle key down event for the textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent newline in textarea
      if (textareaContent.trim() === "") {
        setIsInvalid(true);
        setTimeout(() => setIsInvalid(false), 300); // Reset isInvalid after 0.3 seconds
      } else {
        callToOpenAI();
      }
    }
  };

  // Handle textarea change event
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaContent(e.target.value);
  };

  // Wrapper for textarea change event handler
  const handleInputChange = (e: unknown) => {
    const event = e as React.ChangeEvent<HTMLTextAreaElement>;
    handleTextareaChange(event);
  };

  // Wrapper for textarea key down event handler
  const handleInputKeyDown = (e: unknown) => {
    const event = e as React.KeyboardEvent<HTMLTextAreaElement>;
    handleKeyDown(event);
  };

  // Function to call OpenAI API and update the chat messages
  const callToOpenAI = async () => {
    const userMessage: ChatMessage = { role: "user", content: textareaContent };
    const updatedChats = chats.map((chat) =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    );
    setChats(updatedChats);
    setTextareaContent(""); // Clear the textarea

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages:
        updatedChats.find((chat) => chat.id === activeChatId)?.messages || [],
      temperature: 1,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: response.choices[0].message.content ?? "", // Provide a default value if null
    };
    setChats((chats) =>
      chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      )
    );
  };

  // Function to handle adding a new chat tab
  const handleAddTab = () => {
    const newChatId = chats.length + 1;
    const newChat: Chat = {
      id: newChatId,
      messages: initialMessages,
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChatId);
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="flex flex-col px-4">
          <div className="flex w-full flex-col">
            <Tabs
              aria-label="Options"
              placement="start"
              selectedKey={String(activeChatId)}
              onSelectionChange={(key) => setActiveChatId(Number(key))}
            >
              {chats.map((chat) => (
                <Tab key={String(chat.id)} title={`Chat #${chat.id}`}>
                  <Card className="w-[400px] flex">
                    <CardHeader className="flex gap-3">
                      <div className="flex w-full flex-wrap items-center justify-center gap-2 sm:justify-between">
                        <p className="text-md">WhaleGPT</p>
                        <div className="inline-flex justify-center gap-4">
                          <Tabs radius="full" aria-label="Tabs radius">
                            <Tab key="creative" title="Creative" />
                            <Tab key="formal" title="Formal" />
                          </Tabs>
                          <ThemeSwitch />
                        </div>
                      </div>
                    </CardHeader>
                    <Divider />
                    <CardBody className="flex gap-3 ">
                      {chat.messages
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

                            <p className="max-w-[330px] ml-2 text-small relative rounded-medium bg-content2 px-4 py-3 text-default-600">
                              {isValidURL(message.content) ? (
                                <Image
                                  isBlurred
                                  width={200}
                                  src={message.content}
                                  alt="Image..."
                                />
                              ) : (
                                message.content
                              )}
                            </p>
                          </div>
                        ))}
                    </CardBody>
                    <Divider />
                    <CardFooter>
                      <Textarea
                        isInvalid={isInvalid}
                        placeholder="Type your message here"
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
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
                            className="pt-8 pb-8 mr-1"
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

          <div className="flex flex-col gap-4 mt-20  items-center justify-center ">
            <Card className="max-w-[500px]">
              <CardBody>
                <small className="text-default-500">
                  รอเพิ่ม: สามารถตอบปัญหา จากรูปภาพได้ แต่ยัง upload ไม่ได้,
                  ให้วาง URL รูปลงในช่องแชท แล้ว Enter,
                  แล้วค่อยถามคำถามต่อจากนั้นเป็นข้อความถัดไป
                </small>
              </CardBody>
            </Card>
            <Card className="max-w-[500px]">
              <CardBody>
                <small className="text-default-500">
                  รอเพิ่ม: Style การตอบยังปรับไม่ได้ หากต้องการปรับ
                  ให้พิมพ์บอกวิธีการตอบเลย เช่น ให้ตอบสุภาพ
                  แล้วตามด้วยคำถามในข้อความเดียวกัน แล้ว Enter
                </small>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
