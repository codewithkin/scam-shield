import MainChatPage from "@/components/MainChatPage";
import { auth } from "@/lib/auth";
import { createAuthClient } from "better-auth/react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function Chat() {
  // Check if the user is logged in
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  console.log("Session: ", session);

  // If the user is not logged in....
  if (!session) {
    // Redirect to the auth page
    return redirect("/auth");
  }

  // Otherwise, continue as normal
  return <MainChatPage />;
}

export default Chat;
