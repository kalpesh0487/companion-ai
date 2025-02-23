"use client";
import { Companion } from "@prisma/client";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { User } from "@clerk/nextjs/server";
import { useUser } from "@clerk/nextjs";
interface cmProps {
  companion: Companion;
  messages: ChatMessageProps[];
  isLoading: boolean;
}
const ChatMessages = ({ messages = [], isLoading, companion }: cmProps) => {
  const { user } = useUser();
  const [fakeLoading, setFakeLoading] = useState(
    messages.length === 0 ? true : false
  );
  const scrollref = useRef<ElementRef<"div">>(null);
  const userimageurl = user?.imageUrl;
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFakeLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    scrollref?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length,messages]);

  
  return (
    <div className=" flex-1 overflow-y-auto pr-4">
      <ChatMessage
        src={companion.src}
        isLoading={fakeLoading}
        role="system"
        content={`Hello, I am ${companion.name} , ${companion.description}`}
      />

      {messages.map((msg, index) => (
        <ChatMessage
          key={index}
          role={msg.role}
          src={msg.role === "system" ? companion.src:userimageurl}
          content={msg.content}
        />
      ))}
      {isLoading && <ChatMessage role="system" src={companion.src} isLoading />}
      <div ref={scrollref} />
    </div>
  );
};

export default ChatMessages;
