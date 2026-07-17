import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import config from "../config/config";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: config.GEMINI_API_KEY
});

