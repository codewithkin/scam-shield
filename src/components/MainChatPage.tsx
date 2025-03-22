"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface Message {
  role: "user" | "ai";
  content: string;
  scam_words?: string[];
  scamPercentage?: number;
  reason?: string;
  scamScore?: number;
  response?: string; // Simple response for non-scam messages
}

export default function MainChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");

  const { mutate: sendMessage, isPending: loading } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async () => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: message },
      ]);

      const res = await axios.post("/api/scam", { message });
      setMessage("");
      return res.data;
    },
    onSuccess: (response: any) => {
      setMessages((prevMessages) => [...prevMessages, response]);
    },
    onError: (e) => {
      console.log("An error occurred while sending message ", e);
      toast.error(
        "An error occurred while sending message, please try again later",
      );
    },
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await authClient.getSession();
      return res?.data?.user;
    },
  });

  useEffect(() => {
    console.log("Messages: ", messages);
  }, [messages]);

  const getScamColor = (score?: number) => {
    if (!score) return "text-gray-500";
    return score > 75
      ? "text-red-500"
      : score > 40
        ? "text-orange-500"
        : "text-green-500";
  };

  return (
    <section className="w-full h-full">
      <article className="w-full flex justify-between items-center p-4 md:py-4 md:px-8 shadow-md border-b border-slate-200">
        <h2 className="text-xl font-semibold">ScamShield</h2>
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
        {messages.length > 1 ? (
          <article className="w-full h-full p-4">
            {messages.map((message, index) => (
              <motion.div
                key={index}
                className="mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {message.role === "user" ? (
                  <Card>
                    <CardHeader className="flex gap-2 items-center">
                      <Avatar>
                        <AvatarFallback>
                          {profile?.name?.charAt(0)}
                        </AvatarFallback>
                        <AvatarImage
                          src={profile?.image || ""}
                          alt={`${profile?.name} avatar`}
                        />
                      </Avatar>
                      <CardTitle>{profile?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm text-slate-600">
                        {message.content}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <article className="flex flex-col gap-4">
                    {message.response ? (
                      <Card>
                        <CardHeader>
                          <CardTitle>Response</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-600">{message.response}</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <>
                        <Card>
                          <CardHeader>
                            <CardTitle>Scam Words</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-wrap gap-2">
                            {message.scam_words?.map((word) => (
                              <Badge variant="destructive" key={word}>
                                {word}
                              </Badge>
                            ))}
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Reason</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p>{message.reason}</p>
                          </CardContent>
                        </Card>

                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <Card>
                            <CardHeader>
                              <CardTitle>Scam Percentage</CardTitle>
                            </CardHeader>
                            <CardContent className="w-32 h-32 pb-0">
                              <CircularProgressbar
                                value={message.scamPercentage || 0}
                                text={`${message.scamPercentage || 0}%`}
                                styles={buildStyles({
                                  textSize: "16px",
                                  pathColor:
                                    message.scamPercentage! > 75
                                      ? "red"
                                      : message.scamPercentage! > 40
                                        ? "orange"
                                        : "green",
                                  textColor: "#333",
                                  trailColor: "#d6d6d6",
                                })}
                              />
                            </CardContent>
                          </Card>
                        </motion.div>

                        <Card>
                          <CardHeader>
                            <CardTitle>Scam Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className={getScamColor(message.scamScore)}>
                              {message.scamScore}
                            </p>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </article>
                )}
              </motion.div>
            ))}
          </article>
        ) : (
          <article className="w-full h-full flex flex-col justify-center text-center items-center p-20">
            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-sky-700">
              Hey there, {profile?.name}
            </h2>
            <p className="text-slate-600">
              Suspect that an email or a message is a scam? Paste the message
              here, and I'll help.
            </p>
          </article>
        )}

        <form
          className="flex flex-col gap-2 items-center justify-center w-fit h-fit p-8"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Textarea
            placeholder="Paste the message here"
            className="md:min-w-[400px] min-w-full md:max-w-[400px] max-w-full max-h-[300px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button className="w-full" disabled={loading} type="submit">
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
