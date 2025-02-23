"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useProModal } from "@/hooks/use-pro-model";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import axios from "axios";

const ProModel = () => {
  const promodel = useProModal();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted,setIsMounted] = useState(false);

  useEffect(()=>{
    setIsMounted(true);
  },[])

  const onSubscribe = async () => {
    try {
      setIsLoading(true);

      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    
    
    } catch (error: any) {
      toast({
        variant: "destructive",
        description: `Something went wrong+${error.message || ""}`,
      });
    }finally{
        setIsLoading(false);
    }
  };
  if(!isMounted){
    return null;
  }
  return (
    <Dialog open={promodel.isOpen} onOpenChange={promodel.onClose}>
      <DialogContent>
        <DialogHeader className=" space-y-4">
          <DialogTitle className=" text-center">Upgrade To Pro</DialogTitle>
          <DialogDescription className=" text-center space-y-2">
            Create
            <span className=" text-sky-500 font-medium mx-1">Custom Ai</span>
            Companion
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex justify-between">
          <p className=" text-2xl font-medium">
            $9
            <span className=" text-sm font-normal">.99 /month</span>
          </p>
          <Button variant={"premium"} onClick={onSubscribe} disabled={isLoading}>Subscribe</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModel;
