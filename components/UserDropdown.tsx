"use client";
import { UserButton } from "@clerk/nextjs";
import { ChartColumnBigIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function UserDropdown() {
  const router = useRouter();
  return (
    <UserButton
      showName
      appearance={{
        elements: {
          userButtonOuterIdentifier: {
            color: "white",
            // Only the avatar fits next to the logo on phones
            "@media (max-width: 639px)": {
              display: "none",
            },
          },
        },
      }}
    >
      <UserButton.MenuItems>
        <UserButton.Action
          label="Dashboard"
          labelIcon={<ChartColumnBigIcon size={16} />}
          onClick={() => {
            router.push("/dashboard");
          }}
        />
      </UserButton.MenuItems>
    </UserButton>
  );
}
