"use client"
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Menu,Sparkles, } from "lucide-react";
import { Edu_VIC_WA_NT_Beginner, Poppins } from "next/font/google";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./Modetoggle";
import MobileSidebar from "./Mobile-sidebar";
import { useProModal } from "@/hooks/use-pro-model";

const font = Poppins({
  weight: "600",
  subsets: ["latin"],
});

const font2 = Edu_VIC_WA_NT_Beginner({
  weight: "700",
  subsets: ["latin"],
});

interface NavBarProps{
  isPro:boolean;
}

const Navbar = ({isPro}:NavBarProps) => {
  const promodel = useProModal();
  return (
    <div className=" fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
      <div className=" flex items-center">
        <MobileSidebar isPro={isPro}/>
        <Link href={"/"}>
          <h1
            className={cn(
              "hidden md:block text-xl md:text-3xl font-bold text-primary",
              font2.className
            )}
          >
            Companion.AI
          </h1>
        </Link>
      </div>
      <div className=" flex items-center gap-x-3">
        <ModeToggle></ModeToggle>
        {!isPro &&  (<Button variant={"premium"} size="sm" onClick={promodel.onOpen}>
          Upgrade <Sparkles className=" h-4 w-4 fill-white text-white ml-2" />
        </Button>)}
        <UserButton afterSignOutUrl="/"/>
      </div>
    </div>
  );
};

export default Navbar;
