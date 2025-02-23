import { Redis } from "@upstash/redis";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { env } from "process";

export type CompanionKey = {
  companionName: string;
  modelName: string;
  userId: string;
};
const PineconeClient = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

export class MemoryManager {
  private static instance: MemoryManager;
  private history: Redis;
  private vectorDBClient: Pinecone;

  public constructor() {
    this.history = Redis.fromEnv();
    this.vectorDBClient = new Pinecone();
  }

  public async init() {
    if (this.vectorDBClient instanceof Pinecone) {
      this.vectorDBClient = PineconeClient;
    }
  }

  public async vectorSearch(
    recentChatHistory: string,
    companionFileName: string
  ) {
    const pc = <Pinecone>this.vectorDBClient;
    const pci = pc.index(process.env.PINECONE_INDEX! || "");

    const vectorStore = await PineconeStore.fromExistingIndex(
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
      { pineconeIndex: pci }
    );

    const similardocs = await vectorStore
      .similaritySearch(recentChatHistory, 3, { __filename: companionFileName })
      .catch((err) => {
        console.log("error in momory.ts similardocs:", err);
      });
    return similardocs;
  }

  public static async getInstace(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
      await MemoryManager.instance.init();
    }

    return MemoryManager.instance;
  }

  private generateRedisCompanionKey(companionKey: CompanionKey): string {
    return `${companionKey.companionName}-${companionKey.modelName}-${companionKey.userId}`;
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId === "undefined") {
      console.log("Incorrect companion key");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    const result = await this.history.zadd(key, {
      score: Date.now(),
      member: text,
    });
    

    return result;
  }

  public async readLatestHistory(companionKey: CompanionKey) {
    if (!companionKey || typeof companionKey.userId === "undefined") {
      console.log("Incorrect companion key");
      return "";
    }

    const key = this.generateRedisCompanionKey(companionKey);
    let result = await this.history.zrange(key, 0, Date.now(), {
      byScore: true,
    });

    result = result.slice(-30).reverse();

    const resentChats = result.reverse().join("\n");
    return resentChats;
  }

  public async seedChatHistory(
    seedContent: string,
    delimiter: string = "\n",
    companionkey: CompanionKey
  ) {
    const key = this.generateRedisCompanionKey(companionkey);

    if (await this.history.exists(key)) {
      console.log("use already has chat history");
      return;
    }

    const content = seedContent.split(delimiter);
    let counter = 0;

    for (const line of content) {
      await this.history.zadd(key, { score: counter, member: line });
      counter += 1;
    }
  }
}
