import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import { generateResponse, generateChatTitle } from "../services/ai.service.js";

export async function sendMessage(req,res) {
    const {message, chat:chatId} = req.body;

    let title=null;

    if(!chatId){
        title = await generateChatTitle(message);
        
        chat = await chatModel.create({
            user: req.user.id,
            title
           })

    }
    
        
    const userMessage = await messageModel.create({
        chat: chatId || chat._id,
        contect: message,
        role: "user"
    })
    
    const messages = await messageModel.find({chat: chatId || chat._id});
    
    const aiMessage = await messageModel.create({
        chat: chatId || chat._id,
        content: result,
        role:"ai"
    })
    const result = await generateResponse(messages);
    
    res.status(201).json({
        title,
        chat,
        aiMessage
    })
}


export async function getChats(req,res){
    const user = req.user;
    const chats = await chatModel.find({user: user.id});

    res.status(200).json({
        message: "chats retrieved successfully",
        chats
    })
}

export async function getMessages(req,res){
    const {chat:chatId} = req.params;

    const chat = await chatModel.findOne({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    const messages = await messageModel.find({chat: chatId});

    res.status(200).json({
        message: "messages retrieved successfully",
        messages
    })
}

export async function deleteChat(req,res){
    const {chat:chatId} = req.params;

    const chat = await chatModel.findOneAndDelete({
        _id: chatId,
        user: req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message: "Chat not found"
        })
    }

    await messageModel.deleteMany({chat: chatId});

    res.status(200).json({
        message: "Chat deleted successfully"
    })
}