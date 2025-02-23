import prismadb from '@/lib/prismadb';
import { auth, redirectToSignIn } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import ChatClient from './components/client';

interface ChatIdPageProps{
    params:{chatId:string}
}

const ChatIdPage = async({params}:ChatIdPageProps) => {
    const {userId} = auth();

    if(!userId) return redirectToSignIn();

    console.log("Fetching companion with ID:", params.chatId); // Log chat ID

    const response = await fetch(`http://127.0.0.1:5000/api/companions/${params.chatId}`);

    const companion = await response.json(); 

    console.log("Fetched Companion:", companion); // Log the companion object

    if(!companion){
        return redirect("/")
    }

  return (
    //@ts-ignore
    <ChatClient companion={companion}/>
  )
}

export default ChatIdPage