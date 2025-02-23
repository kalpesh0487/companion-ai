"use client";
import ChatHeader from "@/components/ChatHeader";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { useCompletion } from "ai/react";
import ChatForm from "@/components/ChatForm";
import ChatMessages from "@/components/ChatMessages";
import { ChatMessageProps } from "@/components/ChatMessage";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";

interface Props {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}
const ChatClient = ({ companion }: Props) => {
  const router = useRouter();
  
  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );

  console.log("Companion Message: - ",companion.messages)

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // const { input, isLoading, handleInputChange, handleSubmit, setInput } =
  //   useCompletion({
  //     api: `/api/chat/${companion.id}`,
  //     onFinish(prompt, completion) {
  //       const systemMessage: ChatMessageProps = {
  //         role: "system",
  //         content: completion,
  //       };

  //       {
  //         console.log("[systemMessages] ->" + completion);
  //       }
  //       setMessages((current) => [...current, systemMessage]);
  //       setInput("");
  //       router.refresh();
  //     },
  //   });

  const onsubmit = async () => {
    if (input.trim() === "") return;

    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };
    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);
    try {
      const axiosresponse = await axios.post(`https://python-companion-ai.onrender.com/api/chat/${companion.id}`, {
        prompt: input,
      });
      console.log(JSON.stringify(axiosresponse));
      const sysmsg:ChatMessageProps ={
        role:"system",
        content:axiosresponse.data.response
      } ;

      setMessages((current) => [...current, sysmsg]);
      setInput("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <div className=" border-t border-primary/10 py-4 flex items-center gap-x-2">
        <Input
          disabled={isLoading}
          value={input}
          onChange={handleInputChange}
          placeholder="Type a message"
          className=" rounded-lg bg-primary/10"
        />
        <Button disabled={isLoading} variant="ghost" onClick={onsubmit}>
          <SendHorizonal className=" h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ChatClient;
