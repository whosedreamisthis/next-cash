import { Show, SignInButton, SignUpButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import UserDropdown from "@/components/UserDropdown";

// Reads the session (Clerk's server <Show> calls auth()), so the layout renders
// it inside <Suspense>. Otherwise every page would wait for it and loading.tsx
// couldn't show.
export default function NavAuth() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton>
          <Button variant="link" className="text-white">
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button variant="link" className="text-white">
            Sign Up
          </Button>
        </SignUpButton>
      </Show>
      <Show when="signed-in">
        <UserDropdown />
      </Show>
    </>
  );
}
