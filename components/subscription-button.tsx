"use client"
 
import React, { useState } from 'react'
import { Button } from './ui/button'
import { Sparkle, Sparkles } from 'lucide-react'
import { useProModal } from '@/hooks/use-pro-model'
import { Toast } from './ui/toast'
import { useToast } from './ui/use-toast'
import axios from 'axios'

const SubscriptionButton = ({isPro}:{isPro:boolean}) => {

    const promodel = useProModal();
    const [isLoading, setIsLoading] = useState(false);
    const {toast} = useToast();
    const onclick = async ()=>{
        try {
            setIsLoading(true);
            const response = await axios.get("/api/stripe");

            window.location.href = response.data.url
        } catch (error) {
            toast({
                variant:"destructive",
                description:"Something went wrong"
            })
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <Button disabled={isLoading} onClick={onclick} size="sm" variant={isPro ? "default":"premium"}>
        {isPro ? "Manage Subscription":"Upgrade"}
        {!isPro && <Sparkles className=' h-4 w-4 ml-2 fill-white'/> }
    </Button>
  )
}

export default SubscriptionButton