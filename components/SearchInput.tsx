"use client";
import { Search } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import qs from "query-string"

const SearchInput = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const catagoryId = searchParams.get("catagory")
    const name = searchParams.get("name");

    const [value,setValue] = useState(name || "");
    const deboucedValue = useDebounce<string>(value,600);


    const onchange: ChangeEventHandler<HTMLInputElement> = (e)=>{
        setValue(e.target.value);
    }

    useEffect(()=>{
        const query = {
            name: deboucedValue,
            catagoryId:catagoryId,
        };

        const url = qs.stringifyUrl({
            url:window.location.href,
            query
        },{skipEmptyString:true,skipNull:true})

        router.push(url)
    },[deboucedValue,router,catagoryId])

  return (
    <div>
      <div className="relative">
        <Search className=" absolute h-4 w-4 top-3 left-4 text-muted-foreground" />
        <Input className=" bg-primary/10 pl-10" placeholder="Search..." onChange={onchange} value={value} />
      </div>
    </div>
  );
};

export default SearchInput;
