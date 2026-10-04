import Link from "next/link";
import { Suspense } from "react";
import { ChartColumnBigIcon } from "lucide-react";
import { Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex flex-1 items-center justify-center bg-white bg-[url(/piggy-pattern.svg)] bg-size-[240px] px-4 py-20">
      {/* A soft white glow keeps the text readable over the pattern */}
      <div className="flex flex-col items-center gap-4 rounded-3xl bg-white/85 px-8 py-10 text-center shadow-[0_0_60px_40px_rgb(255_255_255/0.85)] sm:px-12">
        <h1 className="flex items-center gap-2 text-4xl font-bold sm:text-5xl">
          <ChartColumnBigIcon className="size-10 text-lime-500 sm:size-12" />
          NextCash
        </h1>
        <p className="text-lg sm:text-2xl">Track your finances with ease</p>
        <div className="mt-2 flex h-9 gap-2">
          {/* Reading the session is dynamic, so it streams in after the
              static shell */}
          <Suspense>
            <HomeActions />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

function HomeActions() {
  return (
    <>
      <Show when="signed-out">
        <Button
          size="lg"
          className="bg-lime-600 px-5 text-white hover:bg-lime-700"
          nativeButton={false}
          render={<Link href="/sign-in" />}
        >
          Sign in
        </Button>
        <Button
          size="lg"
          className="px-5"
          nativeButton={false}
          render={<Link href="/sign-up" />}
        >
          Sign up
        </Button>
      </Show>
      <Show when="signed-in">
        <Button
          size="lg"
          className="bg-lime-600 px-5 text-white hover:bg-lime-700"
          nativeButton={false}
          render={<Link href="/dashboard" />}
        >
          Go to dashboard
        </Button>
      </Show>
    </>
  );
}
