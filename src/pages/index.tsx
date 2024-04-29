import Head from "next/head";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default function Home() {
  return (
    <>
      <Head>
        <title>PPBL 2024</title>
        <meta
          name="description"
          content="Plutus Project-Based Learning 2024, from Gimbalabs & Friends"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex w-full flex-col items-center justify-center">
        <Tabs
          defaultValue="home"
          className="flex w-full flex-col items-center justify-center md:mt-10"
        >
          <TabsList className="mx-auto flex w-full flex-row justify-between md:w-2/3">
            <TabsTrigger value="home">home</TabsTrigger>
            <TabsTrigger value="calendar">calendar</TabsTrigger>
            <TabsTrigger value="course">course</TabsTrigger>
            <TabsTrigger value="about">about</TabsTrigger>
          </TabsList>

          <TabsContent value="home">
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
              <p className="text-center text-sm text-indigo-300 md:text-2xl">
                module 101 goes live 2024-05-02
              </p>
              <h1 className="my-[3rem] text-2xl font-extrabold tracking-tight md:text-[3rem]">
                Plutus Project-Based Learning 2024
              </h1>
              <div className="mx-auto mt-[5rem] flex w-full flex-row justify-between md:w-3/4">
                <Link href="https://github.com/orgs/gimbalabs/teams/plutus-project-based-learning-2024/repositories">
                  <GitHubLogoIcon width={50} height={50} />
                </Link>
                <Link href="https://gimbalabs.com">
                  <Image
                    className="rounded-full"
                    src="/g.png"
                    width={50}
                    height={50}
                    alt="g"
                  />
                </Link>
                <Link href="https://discord.gg/NZrBvwPq">
                  <DiscordLogoIcon width={50} height={50} />
                </Link>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="calendar">
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
              coming soon
            </div>
          </TabsContent>
          <TabsContent value="course">
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
              coming soon
            </div>
          </TabsContent>
          <TabsContent value="about">
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-5">
              coming soon
            </div>
          </TabsContent>
        </Tabs>
        <div className="w-2/3">
          <p className="text-left font-mono text-[1.5rem]">
            ppbl2024 $ <span className="animate-pulse">_</span>
          </p>
        </div>
      </main>
    </>
  );
}
