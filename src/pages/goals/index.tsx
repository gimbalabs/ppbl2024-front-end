import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import goalsData from "~/data/goals.json";

export default function CommunityGoalsPage() {
  return (
    <main className="flex flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center px-5 md:w-2/3">
        <h1 className="my-5 text-4xl">PPBL 2024: Community Goals</h1>
        <p className="py-1 text-xl">What are your goals for PPBL 2024?</p>
        <p className="mb-5">
          To add yours to this page, complete{" "}
          <Link href="https://www.andamio.io/course/ppbl2024/103/lesson/2">
            Lesson 103.2
          </Link>
          .
        </p>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {goalsData.goals.map((goal, i) => (
            <Card key={i} className="border border-amber-500">
              <CardHeader className="font-bold text-sm uppercase">{goal.date}</CardHeader>
              <CardContent className="flex min-h-[200px]">
                {goal.goal}
              </CardContent>
              <CardFooter className="flex flex-col w-full justify-start items-start">
                <p className="font-bold">{goal.name}</p>
                <p className="font-light text-sm uppercase">{goal.organization}</p>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
