"use client";
import { useProModal } from "@/hooks/use-pro-model";
import { cn } from "@/lib/utils";
import { Divide, Home, Plus, Settings } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface SidebarPro{
  isPro: boolean;
}

const Sidebar = ({isPro}:SidebarPro) => {
  const pathname = usePathname();
  const router = useRouter();
  const promodel = useProModal();
  const routes = [
    { icon: Home, href: "/", lable: "Home", pro: false },
    { icon: Plus, href: "/companion/new", lable: "Create", pro: true },
    { icon: Settings, href: "/settings", lable: "Settings", pro: false },
  ];

  const onNavigate = (url: string, pro: boolean) => {
    if(pro && !isPro){
      return promodel.onOpen();
    }
    return router.push(url);
  };

  return (
    <div className=" space-y-4 flex flex-col h-full text-primary bg-secondary">
      <div className="p-3 flex flex-1 justify-center">
        <div className="space-y-2">
          {routes.map((route, index) => (
            <div
              onClick={() => onNavigate(route.href, route.pro)}
              key={index}
              className={cn(
                " text-muted-foreground text-xs group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary/10 rounded-lg transition",
                pathname === route.href && "bg-primary/10 text-primary"
              )}
            >
              <div className="flex flex-col gap-y-2 items-center flex-1">
                <route.icon className="h-5 w-5" />
                {route.lable}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
