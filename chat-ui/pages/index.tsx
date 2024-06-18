import React from "react";
import { Button, Kbd,Input,Textarea, Tabs, Tab, Switch, Card, CardHeader, CardBody, CardFooter, Divider, Image, Link, Snippet, Code, button as buttonStyles } from "@nextui-org/react";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import { CameraIcon } from './CameraIcon';
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
                    <Image
                      alt="nextui logo"
                      height={40}
                      radius="sm"
                      src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                      width={40}
                    />
                    <div className="flex flex-col">
                      <p className="text-md">NextUI</p>
                      <p>Make beautiful websites regardless of your design experience.</p>
                    </div>
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
<Button isIconOnly color="warning" variant="faded" aria-label="Take a photo">
        <CameraIcon />
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
