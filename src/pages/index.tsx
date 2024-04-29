import Head from "next/head";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import Image from "next/image";

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
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col gap-12 px-4 py-16 ">
          <p className="text-center text-2xl text-indigo-300">
            module 101 goes live 2024-05-02
          </p>
          <h1 className="my-[3rem] text-[8rem] font-extrabold tracking-tight">
            Plutus Project-Based Learning 2024
          </h1>
          <div className="mx-auto flex w-3/4 flex-row justify-between">
            <Link href="https://github.com/orgs/gimbalabs/teams/plutus-project-based-learning-2024/repositories">
              <GitHubLogoIcon width={80} height={80} />
            </Link>
            <Link href="https://gimbalabs.com">
              <Image
                className="rounded-full"
                src="/g.png"
                width={80}
                height={80}
                alt="g"
              />
            </Link>
            <Link href="https://discord.gg/NZrBvwPq">
              <DiscordLogoIcon width={80} height={80} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
