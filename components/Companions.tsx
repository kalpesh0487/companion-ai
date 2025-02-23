import { Companion } from "@prisma/client";
import Image from "next/image";
import React from "react";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";

interface CompanionProps {
  data: (Companion & {
    _count: {
      messages: number;
    };
  })[];
}

const Companions = ({ data }: CompanionProps) => {
  console.log("Comapion Data's",data);
  // console.log("data is : ",data);
  if (data.length === 0) {
    return (
      <div className=" pt-10 flex flex-col justify-center items-center space-y-3">
        <div className=" relative w-60 h-60">
          <Image fill className=" grayscale" alt="Empty" src="/robot.svg" />
        </div>
        <p className=" text-sm text-muted-foreground">
          No companions Fount !!!
        </p>
      </div>
    );
  }
  return (
    <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
      {data.map((item) => (
        <Card
          key={item.id}
          className=" bg-primary/10 rounded-xl cursor-pointer hover:opacity-75 transition border-0"
        >
          <Link href={`/chat/${item.id}`}>
            <CardHeader className=" flex items-center justify-center text-center text-muted-foreground">
              <div className=" relative w-32 h-32">
                <Image
                  src={`${item.src}`}
                  fill
                  className=" rounded-xl object-cover"
                  alt="Companion"
                />
              </div>
              <p className=" font-bold">{item.name}</p>
              <p className=" text-xs max-w-44 px-5 break-words">
                {item.description}
              </p>
            </CardHeader>
            <CardFooter className=" flex items-center justify-between text-xs text-muted-foreground">
              <p className=" lowercase">
                @{item.name}
              </p>
              <div className="flex items-center">
                <MessagesSquare className=" w-3 h-3 mr-1"/>
                
                
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default Companions;
