import React, { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";
interface cfProps {
  input: string;
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onsubmit: (
    e: FormEvent<HTMLFormElement>,
    chatRequestOptions?: ChatRequestOptions | undefined
  ) => void;
  isLoading: boolean;
}
const ChatForm = ({
  input,
  handleInputChange,
  onsubmit,
  isLoading,
}: cfProps) => {
  return (
    <form
      onSubmit={onsubmit}
      className=" border-t border-primary/10 py-4 flex items-center gap-x-2"
    >
        <Input disabled={isLoading} value={input} onChange={handleInputChange} placeholder="Type a message" className=" rounded-lg bg-primary/10"/>
        <Button disabled={isLoading} variant="ghost">
            <SendHorizonal className=" h-6 w-6"/>
        </Button>
    </form>
  );
};

export default ChatForm;
