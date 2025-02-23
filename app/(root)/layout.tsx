import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { checkSubscription } from "@/lib/subscription";
import React from "react";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const ispro = await checkSubscription();
  return (
    <div className="h-full">
      <Navbar isPro={ispro}></Navbar>
      <div className=" hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
        <Sidebar isPro={ispro}/>
      </div>
      <div className=" md:pl-20 pt-16 h-full">{children}</div>
    </div>
  );
};

export default RootLayout;
