import React from "react";
import { Avatar, Button, Kbd,Input,Textarea, Tabs, Tab, Switch, Card, CardHeader, CardBody, CardFooter, Divider, Image, Link, Snippet, Code, button as buttonStyles } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { CameraIcon } from '@/components/CameraIcon';
import {
  TwitterIcon,
  GithubIcon,
  HeartFilledIcon,
  SearchIcon,
} from "@/components/icons";

export default function IndexPage() {
  const [isVertical, setIsVertical] = React.useState(true);
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-lg text-center justify-center">
          <h1 className={title()}>Whale&nbsp;</h1>
          <h1 className={title({ color: "violet" })}>GPT&nbsp;</h1>
          <br />
          <h4 className={subtitle({ class: "mt-4" })}>
            Beautiful, Customer Helper GPT
          </h4>
        </div>

        <div className="flex flex-col px-4">
          <Switch className="mb-4" isSelected={isVertical} onValueChange={setIsVertical}>
            Vertical
          </Switch>
          <div className="flex w-full flex-col">
            <Tabs aria-label="Options" isVertical={isVertical}>
              <Tab key="chat1" title="Chat #1">
                <Card className="max-w-[400px]">
                  <CardHeader className="flex gap-3">
                    <Image
                      alt="nextui logo"
                      height={40}
                      radius="sm"
                      src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                      width={40}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">NextUI</p>
                      <p className="text-small text-default-500">nextui.org</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody className="flex gap-3 flex-col">
                     <Card className="max-w-[340px]">
                        <CardHeader className="justify-between">
                          <div className="flex gap-5">
                            <Avatar isBordered radius="full" size="md" src="https://nextui.org/avatars/avatar-1.png" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                              <h4 className="text-small font-semibold leading-none text-default-600">Zoey Lang</h4>
                              <h5 className="text-small tracking-tight text-default-400">@zoeylang</h5>
                            </div>
                          </div>
                        </CardHeader>
                        <CardBody className="px-3 py-0 text-small text-default-400">
                          <p>
                            Frontend developer and UI/UX enthusiast. Join me on this coding adventure!
                          </p>
                          <span className="pt-2">
                            #FrontendWithZoey 
                            <span className="py-2" aria-label="computer" role="img">
                              💻
                            </span>
                          </span>
                        </CardBody>
                      </Card>
                  </CardBody>
                  <Divider/>
                  <CardFooter>
                    <Textarea
                      label="Description"
                      placeholder="Enter your description"
                      className="flex"
                      endContent={
                        <Kbd className="hidden lg:inline-block" keys={["command"]}>
                          Enter
                        </Kbd>
                      }
                      startContent={
                        <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
                      }
                    />
                  </CardFooter>
                </Card>
              </Tab>

              <Tab key="chat2" title="Chat #2">
                <Card className="max-w-[400px]">
                  <CardHeader className="flex gap-3">
                    <Image
                      alt="nextui logo"
                      height={40}
                      radius="sm"
                      src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                      width={40}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">NextUI</p>
                      <p className="text-small text-default-500">nextui.org</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>Make beautiful websites regardless of your design experience.</p>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <Textarea
                      label="Description"
                      placeholder="Enter your description"
                      className="max-w-xs"
                    />
                  </CardFooter>
                </Card>
              </Tab>

              <Tab key="chat3" title="Chat #3">
                <Card className="max-w-[400px]">
                  <CardHeader className="flex gap-3">
                    <Image
                      alt="nextui logo"
                      height={40}
                      radius="sm"
                      src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                      width={40}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">NextUI</p>
                      <p className="text-small text-default-500">nextui.org</p>
                    </div>
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    <p>Make beautiful websites regardless of your design experience.</p>
                  </CardBody>
                  <Divider />
                  <CardFooter>
                    <Textarea
                      label="Description"
                      placeholder="Enter your description"
                      className="max-w-xs"
                    />
                  </CardFooter>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className="mt-8">
        <div className="flex gap-4 items-center">
            <Button color="default">
              Button
            </Button>
              <Button color="default">
              Button
            </Button>
            </div>
          <Snippet hideCopyButton hideSymbol variant="bordered">
            <span>
              Get started by editing{" "}
              <Code color="primary">pages/index.tsx</Code>
            </span>
          </Snippet>
        </div>
      </section>
    </DefaultLayout>
  );
}
