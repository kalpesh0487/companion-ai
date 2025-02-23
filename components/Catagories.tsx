"use client";
import React from "react";

import { Catagory } from "@prisma/client";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string"
interface Catagoriesprops {
  data: Catagory[];
}

const Catagories = ({ data }: Catagoriesprops) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    console.log("Categories data: ",data);

    const catagoryId = searchParams.get('catagoryId');
    const onClick = (id:string | undefined)=>{
        const query = {catagoryId:id}

        const url = qs.stringifyUrl({
            url:window.location.href,
            query,
        },{skipNull:true})

        router.push(url)
    }


  return (
    <div className=" w-full overflow-x-auto space-x-2 flex p-1">
        <button
          onClick={()=>onClick(undefined)}
          className={cn(
            "flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition",!catagoryId ? "bg-primary/25":"bg-primary/10"
          )}
        >
          New
        </button>
      {data.map((data) => (
        <button
          onClick={()=>onClick(data.id)}
          key={data.id}
          className={cn(
            "flex items-center text-center text-xs md:text-sm px-2 md:px-4 py-2 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition",data.id === catagoryId ? "bg-primary/25":"bg-primary/10"
          )}
        >
          {data.name}
        </button>
      ))}
    </div>
  );
};

export default Catagories;
