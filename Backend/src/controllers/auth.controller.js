import config from '../config/config.js';
import userModel from '../models/user.model.js';
import { sendEmail } from '../services/mail.service.js';
import jwt from "jsonwebtoken";

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

    const emailVerificationToken = jwt.sign({
        email: user.email
    }, config.JWT_SECRET)

    await sendEmail({
        to: email,
        subject: "Welcome to Perplexity",
        text: "Hi there! Welcome to Perplexity. We're excited to have you on board.",
        html: `<h1>Hi ${username}!</h1><p>Welcome to Perplexity. We're excited to have you on board.</p>
        <p>Please verify your email by clicking the link below:</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        `
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

export const verifyEmailController = async (req, res)=>{
    const {token} = req.query;
    const decoded = jwt.verify(token, config.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({
            message: "Invalid Token",
            success: false,
            err: "Invalid Token"
        })
    }

    const email = decoded.email;
    const user = await userModel.findOne({email});

    if(!user){
        return res.status(400).json({
            message: "User not found",
            success: false,
            err: "User not found"
        })
    }

    user.verified=true;
    await user.save();

    // return res.status(200).json({
    //     message: "User is verified successfully",
    //     success: true
    // })

    const html = `
    <h1>Email Verified Successfully</h1>
    <p>Your email has been verified successfully. You can now login to your account.</p>
    <a href="http://localhost:3000/login">Login</a>
    `
    return res.status(200).send(html);
}

export const loginController = async (req,res)=>{

};

export const logoutController = (req,res)=>{
};

