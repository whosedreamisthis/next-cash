import { Suspense } from "react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-1 items-center justify-center p-8">
      {/* <SignUp /> reads the URL, which is only known at request time */}
      <Suspense>
        <SignUp />
      </Suspense>
    </div>
  );
}
