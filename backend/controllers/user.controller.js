import express from "express";
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";


import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFDocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connection.model.js";
import { connect } from "http2";



const convertUserDataToPDF = async (userData) => {
        const doc = new PDFDocument();

        const outputpath = crypto.randomBytes(32).toString("hex") + ".pdf";
        const stream = fs.createWriteStream("uploads/" + outputpath);

        doc.pipe(stream);
        doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100});
        doc.fontSize(14).text(`Name: ${userData.userId.name}`);
        doc.fontSize(14).text(`Username: ${userData.userId.username}`);
        doc.fontSize(14).text(`Email: ${userData.userId.email}`);
        doc.fontSize(14).text(`Bio: ${userData.bio}`);
        doc.fontSize(14).text(`Current Position: ${userData.currPost}`);

        doc.fontSize(14).text("Past Work: ")
        userData.pastWork.forEach( (work, index) => {
            doc.fontSize(14).text(`Company Name: ${work.company}`);
            doc.fontSize(14).text(`Position: ${work.position}`);
            doc.fontSize(14).text(`Years: ${work.years}`);
        });

        doc.end();
        return outputpath;
};

export const register = async (req, res) => {
 
    const { name, email, password, username } = req.body;

    if (!name || !username || !email || !password){
        return res.status(500).json({message: "All fields are required"});
    }

    const user = await User.findOne({
  $or: [{ email }, { username }]
});


    if ( user ) {
        return res.status(400).json({ message: "User already exists"});
    }

    const hashedPassword =  await bcrypt.hash(password, 10);
    const newUser = new User({
        name, 
        password: hashedPassword,
        email,
        username
    });
    await newUser.save();

    const profile = new Profile({userId: newUser._id});
    await profile.save();
    return res.status(200).json({message: "User Registered Successfully"});
};

export const login = async (req, res) => {

    const { email, password } = req.body;
    if( !email || !password ) {
        return res.status(400).json({message: "All fields are reqired"});
    }

    const user = await User.findOne({email});
    if( !user ) {
        return res.status(404).json({message:"User does not exist"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if( !isMatch ) {
        return res.status(400).json({message:"Invalid Credentials"});
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id:user._id }, { token });

    return res.json({mesaage:"Login Success", token: token });
};

export const uploadProfilePicture = async (req, res) => {
    
    const { token } = req.body;
    const user = await User.findOne({token});

    if ( !user ) {
        return res.status(404).json({message:"User not found"});
    }
    user.profilePicture = req.file.filename;
    await user.save();
    return res.json({ message:"Profile Picture Uploaded Successfully"});
};

export const updateUserProfile = async (req, res) => {
    const { token, ...newUserData} = req.body;

    const user = await User.findOne( { token });
    if( !user ) {
        return res.status(404).json({ message: "User not found"});
    }
    const {username, email} = newUserData;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if ( existingUser ) {
        if(existingUser && String(existingUser._id) !== String(user._id)) {
            return res.status(400).json( { message: "User already exists"});
        }
    }

    Object.assign(user, newUserData);
    await user.save();
    return res.json({ message: "User Updated successfully"});
};

export const getUserAndProfile = async (req, res) => {

    const { token } = req.query;

    const user = await User.findOne({ token });

    if ( !user ) {
        return res.status(404).json({message: "User not found"});
    }
    const userProfile = await Profile.findOne({userId: user._id})
        .populate('userId', 'email username name            profilePicture');

    return res.json({ userProfile })
};

export const updateProfileData = async (req, res) =>  {

    const { token, ...newProfileData } = req.body;
    const userProfile = await User.findOne({ token });

    if (!userProfile ) {
        return res.status(404).json({message: "User not found"});
    }

    const profile_to_update = await Profile.findOne({ userId: userProfile._id});
    Object.assign(profile_to_update, newProfileData);

    await profile_to_update.save();
    return res.json({ message : "Profile Updated"});

};

export const getAllUserProfile = async (req, res) => {

    const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

    return res.json({ profiles });
};

export const downloadProfile = async (req, res) => {

    const user_id = req.query.id;
    const userProfile = await Profile.findOne({ userId: user_id }).populate("userId", 'name username email profilePicture');

    let outputPath = await convertUserDataToPDF(userProfile);

    return res.json({ "message": outputPath });
};

export const sendConnectionRequest = async (req, res) => {

    const { token , connectionId} = req.body;

    const user =await User.findOne({ token });
    if( !user ) {
        return res.status(404).json({message: "User not found"});
    }

    const connectionUser = await User.findOne({ _id: connectionId});

    if( !connectionUser ) {
        return res.status(404).json({ message: "Connection User not found "});
    }

    const existingRequest = await ConnectionRequest.findOne(
        {
            userId: user._id,
            connectionId: connectionUser._id
        }
    );

    if ( existingRequest ) {
        return res.status(400).json({ message: "Request already exists"});
    }

    const request = new ConnectionRequest(
        {
            userId: user._id,
            connectionId: connectionUser._id
        }
    );
    await request.save();
    return res.json({ message: "Request sent"});
};

export const getMyConnectionRequests= async (req, res) => {

    const { token } = req.query;

    const user = await User.findOne({ token});
    if( !user ) {
        return res.status(404).json({ message: "User not found"});
    }

    const connections = await ConnectionRequest.find({ userId: user._id})
    .populate("connectionId", "name username email profilePicture");

    return res.json({ connections });
};

export const getUserGotConnectionRequest= async (req, res) => {

    const { token } = req.query;
    const user = await User.findOne({ token });

    if( !user ) {
        return res.status(404).json({ mesaage : "User not found"});
    }

    const connections = await ConnectionRequest.find({ connectionId: user._id})
    .populate("userId", "name username email profilePicture");

    return res.json({ connections });
} ;

export const acceptConnectionRequest = async (req, res) => {

    const { token, requestId, action_type} = req.body;
    const user = await User.findOne({ token });

    if( !user ) {
        return res.status(404).json({ mesaage : "User not found"});
    }

    const connection = await ConnectionRequest.findOne({_id: requestId });
    if( !connection ) {
        return res.status(404).json({ mesaage: "Connection not found"});
    }

    if(action_type === "accept"){
        connection.status_accepted = true;
    } else {
        connection.status_accepted = false;
    };

    await connection.save();
    return res.json({ message: "Request Updated"});
};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {

    const { username } = req.query;

    const user = await User.findOne({ username });

    if( !user ) {
        return res.status(404).json({ message: "User not found"});
    }

    const userProfile = await Profile.findOne({ userId: user._id }).populate("userId", "name username email profilePicture");

    return res.json({ "profile": userProfile }); 

}

