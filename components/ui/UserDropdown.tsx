"use client";
import { UserButton } from "@clerk/nextjs";
import React from "react";

export default function UserDropdown() {
  return (
    <UserButton
      showName
      appearance={{
        elements: {
          userButtonOuterIdentifier: {
            color: "white",
          },
        },
      }}
    />
  );
}
