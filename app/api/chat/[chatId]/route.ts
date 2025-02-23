import { MemoryManager } from "@/lib/memory";
import prismadb from "@/lib/prismadb";
import { rateLimit } from "@/lib/rate-limit";
import { useUser } from "@clerk/nextjs";
// import {Replicate} from "langchain/llms/replicate"
import { currentUser } from "@clerk/nextjs/server";
import { StreamingTextResponse, LangChainStream, ReplicateStream } from "ai";
import { NextResponse } from "next/server";
import { OpenAI } from "@langchain/openai";

import { ConsoleCallbackHandler } from "langchain/callbacks";
import { CallbackManager } from "@langchain/core/callbacks/manager";
import Replicate from "replicate";

import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {
    const { prompt } = await request.json();
    const user = await currentUser();

    if (!user || !user.firstName || !user.id) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const identifier = request.url + "-" + user.id;
    const success = await rateLimit(identifier);

    if (!success) {
      return new NextResponse("Rate limit exceeded", { status: 401 });
    }

    const companion = await prismadb.companion.update({
      where: {
        id: params.chatId,
      },
      data: {
        messages: {
          create: {
            content: prompt,
            userId: user.id,
            role: "user",
          },
        },
      },
    });

    if (!companion) {
      return new NextResponse("Companion not fount", { status: 404 });
    }

    const name = companion.name;

    const companion_file_name = name + ".txt";

    const companionKey = {
      companionName: name,
      userId: user.id,
      modelName: "llama2-13b",
    };

    const memoryManager = await MemoryManager.getInstace();

    const records = await memoryManager.readLatestHistory(companionKey);

    if (records.length === 0) {
      await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
    }

    

    const recentChatHistory = await memoryManager.readLatestHistory(
      companionKey
    );

    const similardoc = await memoryManager.vectorSearch(
      recentChatHistory,
      companion_file_name
    );

    let relevantHistory = "";

    if (!!similardoc && similardoc.length !== 0) {
      relevantHistory = similardoc.map((doc) => doc.pageContent).join("\n");
    }

    const { handlers } = LangChainStream();


    const model = new ChatGroq({
      apiKey: process.env.GROQ_API_KEY, // Default value.
    });

    const message = new HumanMessage({content:`
        Only generate plain sentence without prefix of who is speaking . Do not use ${name}: prefix.
        
        This is demo chat:
        ${companion.instructions}
        You have to give answers according to this chat. You can express feeling like you are laughing. Include emotions also when it is necessary don't use it every where even if it not neccessary.

        
        Below are the relevant details about ${name}'s past and the conversation you are in.
        ${relevantHistory}

        This is your recent converstion :
        ${recentChatHistory}\n${name}:

        conversation ends.
        Don't generate questions by yourself your task is to just answer the last question relevant to previous question and answer if provided.
        Don't generate conversation in your answer by yourself your task is to just answer the last question relevant to previous and according to the instruction given below.
        Your task to act like that person and respond to user's quetions on behalf of that person.
        just answer this question according to given data. And one thing don't use the provided data as it is to answer questions. Use main key points or important sentences to answer asked question.
        ${prompt}
        `,
      additional_kwargs:{
        
      }},
      );

        console.log("[HumanMessage]-> ----- ",message)

    const re = await model.invoke([message]);
    const resp = String(re.content);
    console.log(resp);
    console.log(
      "------------------------------------------------------------------------------------------------------------------"
    );
    const chunks = resp.split("\n");
    console.log("[Chunks] ->" + chunks);
    console.log(
      "------------------------------------------------------------------------------------------------------------------"
    );
    console.log("[Last chunk] :->" + chunks[chunks.length - 1]);
    console.log(
      "------------------------------------------------------------------------------------------------------------------"
    );
    const response = chunks[0];
    console.log("[response]-> " + response);
    console.log(
      "------------------------------------------------------------------------------------------------------------------"
    );
    await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);
    await memoryManager.writeToHistory("" + response.trim(), companionKey);
    // const {Readable} = require('readable-stream')

    // let s = new Readable();
    // s.push(response);
    // s.push(null);

    if (response !== undefined && response.length > 1) {
      memoryManager.writeToHistory("" + response.trim(), companionKey);

      console.log("[chat Response] this is res  " + response);
      console.log(
        "------------------------------------------------------------------------------------------------------------------"
      );

      await prismadb.companion.update({
        where: {
          id: params.chatId,
        },
        data: {
          messages: {
            create: {
              content: response.trim(),
              role: "system",
              userId: user.id,
            },
          },
        },
      });
    }
    // console.log("[s]->>>>>>"+s)
    return new NextResponse(response,{status:200});
  } catch (error) {
    console.log("error chat post", error);
    return new NextResponse("Internal Server Error from chat api " + error, {
      status: 500,
    });
  }
}
