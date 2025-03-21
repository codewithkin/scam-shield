"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Loader2, Plus, Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { Input } from "./ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function MainChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [input, setInput] = useState("");

  // Create a send mutation
  const { mutate: sendMessage, isPending: loading } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async () => {
      const res = await axios.post("/api/scam", { message });

      return res.data;
    },
    onSuccess: (newMessages: any) => {
      console.log("New messages: ", newMessages);

      // Update the messages array
      setMessages((prevMessages) => [...prevMessages, newMessages]);
    },
    onError: (e) => {
      // Show an error message for logging
      console.log("An error occured while sending message ", e);

      // Show an error toast
      toast.error(
        "An error occured while sending message, please try again later",
      );
    },
  });

  // Get the user's data
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await authClient.getSession();

      return res?.data?.user;
    },
  });

  console.log("Profile: ", profile);

  return (
    <section className="w-full h-full">
      {/* Topbar */}
      <article className="w-full flex justify-between items-center p-4 md:py-4 md:px-8 shadow-md border-b border-slate-200">
        <article>
          <h2 className="text-xl font-semibold">ScamShield</h2>
        </article>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon">
                <Plus size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>New Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </article>

      <article className="flex flex-col justify-center items-center w-full h-full">
        <article className="w-full h-full justify-center text-center items-center p-20">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-700">
            Hey there, {profile?.name}
          </h2>
          <p className="text-slate-600">
            Suspect that an email or a message is a scam ? Paste the message
            here, I can help
          </p>
        </article>

        <form
          className="flex flex-col gap-2 items-center justify-center w-fit h-fit p-8"
          onSubmit={async () => {
            await sendMessage();
          }}
        >
          <Textarea
            name="message"
            placeholder="Paste the message here"
            className="md:min-w-[400px] min-w-full md:max-w-[400px] max-w-full h- max-h-[300px]"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="w-full" variant="default" type="submit">
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} />
            )}
            {loading ? "Sending..." : "Send"}
          </Button>
        </form>
      </article>
    </section>
  );
}
