import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai"
import { AIMessage, HumanMessage, SystemMessage } from "langchain";
import config from "../config/config.js";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: config.GEMINI_API_KEY
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: config.MISTRAL_API_KEY
})

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(messages.map(msg=>{
    if(msg.role == 'user'){
      return new HumanMessage(msg.content);
    }
    else if(msg.role == 'ai'){
      return new AIMessage(msg.content)
    }
  }))

  return response.text;
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