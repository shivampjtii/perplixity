import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage, tool, createAgent } from "langchain";
import * as z from "zod";
import config from "../config/config.js";
import { searchInternet } from "./internet.service.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: config.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: config.MISTRAL_API_KEY
})

const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description: "Use this tool to get the latest information from the internet.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet.")
  })
})


const agent = createAgent({
  model: geminiModel,
  tools: [searchInternetTool],
  agentType: "zero-shot-react-description"
})


export async function generateResponse(messages) {
  const response = await agent.invoke({
    messages: [
      new SystemMessage(`You are a helpful assistant that provides accurate and concise answers to user queries. You have access to a tool that allows you to search the internet for the latest information. Use this tool when necessary to provide up-to-date responses.`),
      ...messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      } else {
        throw new Error(`Unknown message role: ${msg.role}`);
      }
  })]
})
  return response.messages[response.messages.length - 1].text;
}


export async function generateChatTitle(message){
  const response = await mistralModel.invoke([
    new SystemMessage(`You are a helpful assistant that generates a title for a chat based on the user's message. The title should be concise, relevant, and in English.
    User will provide a message, and you will generate a suitable title for it. Please ensure the title is clear and accurately reflects the content of the message.
    It should be a single line, without any additional commentary or explanation.
      `),
    new HumanMessage(`Generate a title for the following message: "${message}"`)
  ])
  return response.text;
}