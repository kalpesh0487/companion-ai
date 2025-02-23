import { Companion, Message } from "@prisma/client";
import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Edit,
  MessageSquare,
  MessagesSquare,
  MoreVertical,
  Trash,
} from "lucide-react";
import BotAvatar from "./BotAvatar";
import { useUser } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";
import axios from "axios";

interface Props {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}
const ChatHeader = ({ companion }: Props) => {
  const router = useRouter();
  const { user } = useUser();
  const {toast} = useToast();


  const onDelete = async ()=>{
    try {
      await axios.delete(`/api/companion/${companion.id}`)
      toast({
        description:"Companion Deleted"
      })

      router.refresh();
      router.push("/")
    } catch (error) {
      toast({
        description:"Something went wrong",
        variant:"destructive"
      })
    }
  }

  return (
    <div className=" flex w-full justify-between items-center border-b border-primary/10 pb-4">
      <div className="flex gap-x-2 items-center">
        <Button onClick={() => router.back()} size="icon" variant="ghost">
          <ChevronLeft className=" h-8 w-8" />
        </Button>
        <BotAvatar src={companion.src} name={companion.name} />
        <div className="flex flex-col gap-y-1">
          <div className=" flex items-center gap-x-2">
            <p className=" font-bold">{companion.name}</p>
            <div className=" flex items-center text-sm text-muted-foreground">
              <MessagesSquare className=" w-5 h-5 mr-2" />
              
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Created by {companion.userName}
          </p>
        </div>
      </div>
      {user?.id === companion.userId && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary" size="icon">
              <MoreVertical />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={()=> router.push(`/companion/${companion.id}`)}>
              <div className="flex justify-center items-center">
                <Edit className=" h-4 w-4 mr-2" /> Edit
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete}>
              <div className="flex justify-center items-center">
                <Trash className=" h-4 w-4 mr-2" /> Delete
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default ChatHeader;
