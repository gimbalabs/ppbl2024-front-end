import Link from "next/link";

export default function BlogPage() {
  return (
    <main className="mx-auto my-8 flex w-full flex-col md:my-24 md:w-2/3 lg:w-1/2">
      <h1>PPBL 2024 Goes Live!</h1>
      <p className="text-sm py-1">Wednesday 2024-05-15 | by Gimbalabs Team</p>

      <h3 className="my-5 font-bold">
        {" "}
        Plutus Project-Based Learning 2024 Launches Today
      </h3>
      <p className="pb-5 text-lg">
        Plutus Project-Based Learning (PPBL) is the free, flagship course from
        Gimbalabs, for anyone who wants to learn to build applications on
        Cardano. PPBL 2024 is the 5th iteration of the course, and we are
        excited to share the latest product of our years of tinkering, reading
        documentation, reviewing Discord conversations, and most importantly,
        learning together.
      </p>
      <p className="pb-5 text-lg">
        We built PPBL because we are, as Hinson says, “adoption maxis”. Our goal
        is to teach people how to build novel applications that solve real
        problems, and that will drive meaningful adoption of Cardano.
      </p>

      <p className="pb-5 text-lg">
        We provide PPBL for free because it&apos;s the right thing to do - but
        also because it serves some of our other goals! Through PPBL, we create
        spaces where collaboration can flourish. By working through the course,
        people have the chance to meet each other, get help, and build trust
        that leads to more substantial partnerships. This is how Gimbalabs built
        a track-record of supporting new projects throughout the Cardano
        ecosystem.
      </p>

      <h3 className="my-5 font-bold">
        {" "}
        Who is Plutus Project-Based Learning 2024 Built For?
      </h3>

      <p className="pb-5 text-lg">
        PPBL 2024 is somewhere in between a technical course for non-technical
        people and a non-technical course for technical people.
      </p>
      <p className="pb-5 text-lg">
        If you&apos;re a developer, PPBL 2024 will give you an overview of the
        architecture of Cardano applications, and provides a survey of options
        for each part of the Cardano development stack. Throughout the course,
        we provide links to deeper courses like the upcoming Mesh PBL, Cardano
        Go PBL, and Aiken PBL, our first entries in a growing list of
        specialized technical courses.
      </p>
      <p className="pb-5 text-lg">
        If you&apos;re a founder or project manager, this course will help you
        build the most important mental models of how Cardano works. Even if you
        are “not a developer”, we want you to be able to reason about the design
        of a Cardano application, to know what&apos;s easy, what&apos;s hard,
        and what kinds of tooling is still in development, so that you can make
        realistic plans for bringing your ideas to life.
      </p>
      <p className="pb-5 text-lg">
        In all cases, we are here to learn by doing. We believe that this is the
        best way to learn anything. Every time we learn from hands-on
        experience, we develop practical skills alongside a deeper intuition of
        how new knowledge is connected. When we are actively participating in
        projects, we&apos;re more likely to bump into other people who are doing
        the same — and this is where collaboration starts.
      </p>

      <h3 className="my-5 font-bold"> About PPBL Live Coding</h3>

      <p className="pb-5 text-lg">
        To accompany the PPBL 2024 course, Gimbalabs hosts a weekly PPBL Live
        Coding session, on Wednesdays from 1430-1600 UTC. All are welcome to ask
        questions about PPBL lessons, get help on projects, and meet up with our
        highly-engaged + big-hearted community.
      </p>
      <p className="pb-5 text-lg">
        We also host dedicated sessions for Cardano Go and Mesh. You can find
        all weekly Gimbalabs meetings on this calendar:{" "}
        <Link href="https://plutuspbl.io/calendar">
          https://plutuspbl.io/calendar
        </Link>
      </p>

      <h3 className="my-5 font-bold"> Quick History of PPBL</h3>

      <p className="pb-5 text-lg">
        This is the 5th iteration of Plutus PBL. The first iteration launched in
        late-2021. In 2022, we tested versions 2 and 3 of PPBL by delivering it
        in Canvas LMS. In 2023 we built a prototype of a Cardano-native course
        platform and used it to deliver the 4th iteration, “PPBL 2023”.
      </p>
      <p className="pb-5 text-lg">
        From last year&apos;s prototype, there is now a full-scale platform
        called Andamio, and{" "}
        <Link href="https://www.andamio.io/course/ppbl2024">
          that&apos;s where you&apos;ll find PPBL 2024
        </Link>
        , the first of several courses that will roll out this year. The team
        building Andamio consists of alumni from all four prior iterations of
        PPBL. It&apos;s our proof case that learning together is a good first
        step in building a strong organization. This is an idea that we&apos;ll
        continue to explore in the months ahead.
      </p>
      <p className="pb-5 text-lg">
        As always, we recognize that Cardano development continues to evolve.
        This course will be updated continually, and will be outdated in time
        for the release of PPBL 2025!
      </p>

      <h3 className="my-5 font-bold"> Where to find PPBL 2024</h3>

      <p className="pb-5 text-lg">
        The first module of Plutus PBL 2024 is live at{" "}
        <Link href="https://www.andamio.io/course/ppbl2024">
          andamio.io/course/ppbl2024
        </Link>
        . Each week, a new course module will be released, with the whole course
        being live at the end of June.
      </p>
      <p className="pb-5 text-lg">
        A companion site is provided at{" "}
        <Link href="https://plutuspbl.io">plutuspbl.io</Link>, featuring live
        demos, lesson examples, and soon, student work.
      </p>

      <h3 className="my-5 font-bold"> How to participate in PPBL 2024</h3>

      <p className="pb-5 text-lg">
        It&apos;s free to get started at{" "}
        <Link href="https://www.andamio.io/course/ppbl2024">
          andamio.io/course/ppbl2024
        </Link>
        , and you can start today.
      </p>
      <p className="pb-5 text-lg">
        All are welcome to participate at weekly Live Coding sessions, on Zoom.
        Please find up-to-date registration links for all meetings at{" "}
        <Link href="https://plutuspbl.io/calendar">plutuspbl.io/calendar</Link>
      </p>
      <p className="pb-5 text-lg">Looking forward to learning with you!</p>
    </main>
  );
}
