"use client";

import * as React from "react";
import Link from "next/link";

import { cn } from "~/lib/utils";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

const ppblRepoLinks: { title: string; href: string; description: string }[] = [
  {
    title: "PPBL 2024 Front End",
    href: "https://github.com/gimbalabs/ppbl2024-front-end",
    description: "Source code for this web site",
  },
  {
    title: "PPBL 2024 Plutus Examples",
    href: "https://github.com/gimbalabs/ppbl2024-plutus-examples",
    description: "Start working with Plutus TX",
  },
  {
    title: "PPBL 2024 Aiken Examples",
    href: "https://github.com/gimbalabs/ppbl-2024-aiken-examples",
    description: "Start building smart contracts with Aiken",
  },
  {
    title: "PPBL 2024 Plu-Ts Examples",
    href: "https://github.com/nelsonksh/gimbalabs-ppbl2024-plu-ts-examples",
    description: "Smart contracts written in Plu-Ts",
  },
  {
    title: "Transaction Examples",
    href: "https://github.com/gimbalabs/ppbl2024-transaction-examples",
    description: "Learn how Cardano works with transaction examples",
  },
  {
    title: "Asteria Front End",
    href: "https://github.com/gimbalabs/mesh-asteria-demo-app",
    description: "Work in progress: Asteria game demo",
  },
  {
    title: "Handy Project Units",
    href: "https://github.com/nelsonksh/Handy-Project-Units",
    description: "Simple project units built for convenience",
  }
];

const liveCodingLinks: { title: string; href: string; description: string }[] =
  [
    {
      title: "Plutus PBL Live Coding",
      href: "https://plutuspbl.io/calendar",
      description: "Wednesdays 1430 UTC",
    },
    {
      title: "Gimbalabs Live Open Spaces",
      href: "https://plutuspbl.io/calendar",
      description: "Thursdays 1430 UTC",
    },
    {
      title: "Cardano Go Live Coding",
      href: "https://plutuspbl.io/calendar",
      description: "Mondays 1300 UTC",
    },
    {
      title: "Mesh Live Coding",
      href: "https://plutuspbl.io/calendar",
      description: "Tuesdays 1300 UTC",
    },
  ];

export default function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            Get Started with Plutus PBL 2024
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="https://app.andamio.io/course/ppbl2024"
                  >
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Plutus PBL 2024
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Course now live at andamio.io
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem
                href="https://app.andamio.io/course/ppbl2024"
                title="Take the Course"
              >
                Text and video content
              </ListItem>
              <ListItem href="/live-examples" title="Project-Based Learning">
                Get hands on experience as a Cardano developer
              </ListItem>
              <ListItem href="https://gimbalabs.com" title="From Gimbalabs">
                Providing open, replicable safe spaces to learn, to explore, and
                to empower individuals and organizations anywhere so that we can
                solve meaningful problems
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem className="text-yellow-500">
          <Link href="/live-examples" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Live Examples
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/goals" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Student Goals
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Course Repositories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {ppblRepoLinks.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Live Sessions</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {liveCodingLinks.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
