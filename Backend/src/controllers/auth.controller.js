import userModel from '../models/user.model.js';
import { sendEmail } from '../services/mail.service.js';

export const registerController = async (req,res)=>{
    const {username, email, password}= req.body;

    const isUserAlreadyExists = await userModel.findOne({
        $or:[
            {email},
            {username}
        ]
    });

    if(isUserAlreadyExists){
        return res.status(400).json({
            message: "User already exists",
            success: false,
            err: "User already exists"
        })
    }

    const user = await userModel.create({
        username,
        email,
        password
    });

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: "Hi there! Welcome to Perplexity. We're excited to have you on board.",
        html: `<h1>Hi ${username}!</h1><p>Welcome to Perplexity. We're excited to have you on board.</p>`

    })

    return res.status(200).json({
        message: "User registered successfully",
        success: true,
        data: {
            username,
            email
        }
    })
};

export const login = async (req,res)=>{
};

export const logout = (req,res)=>{
};

