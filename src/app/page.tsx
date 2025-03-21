"use client";
import MainChatPage from "@/components/MainChatPage";
import { createAuthClient } from "better-auth/react";
import { redirect } from "next/navigation";
const { useSession } = createAuthClient() 

function Chat() {
  // Check if the user is logged in
  const { data: session } = useSession();

  console.log("Session: ", session);

  // If the user is not logged in....
  if(!session) {
    // Redirect to the auth page
    return redirect("/auth");
  }

  // Otherwise, continue as normal
  return (
    <MainChatPage />
  )
}

export default Chat;