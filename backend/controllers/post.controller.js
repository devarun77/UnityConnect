import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import Profile from "../models/profile.model.js";
import Post from "../models/post.model.js";
import Comment from "../models/comments.model.js";

export const createPost = async (req, res) => {

    const { token } = req.body;
    const user = await User.findOne({ token });

    if( !user ) {
        return res.status(404).json({ message: "User not found"});
    }

    const post = new Post({
        userId: user._id,
        body: req.body.body,
        media: req.file != undefined ? req.file.filename : "",
        fileType: req.file != undefined ? req.file.mimetype.split('/')[1]: "", 
    });

    await post.save();
    const populatedPost = await Post.findById(post._id).populate("userId", "name email username profilePicture");

    return res.status(200).json({ message: "Post Created", post: populatedPost });

};

export const getAllPosts = async (req, res) => {

    const posts = await Post.find({active: true}).populate("userId", 'name email username profilePicture');
    return res.json({ posts });
};

export const deletePost = async (req, res) => {

    const { token, post_id} = req.body;
    const user = await User.findOne({ token }).select("_id");

    if( !user) {
        return res.status(404).json({ message: "User not found"});
    }

    const post = await Post.findOne({ _id: post_id});
    if( !post) {
        return res.status(404).json({ message: "Pott not found"});
    }

    if( post.userId.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized"})
    }

    await Post.deleteOne({_id: post_id});
    return res.json({ message: "Post Deleted"});
};

export const commentPost = async (req, res) => { 

    const { token, post_id, commentBody } = req.body;
    const user = await User.findOne({ token }).select("_id");

    if( !user ){
        res.status(404).json({ message: "User not found"});
    }

    const post = await Post.findOne({ _id: post_id});
    if( !post) {
        return res.status(404).json({ message: "Pott not found"});
    }

    const comment = new Comment({
        userId: user._id,
        postId: post._id,
        body: commentBody,  
    })
    await comment.save();
    return res.json({ message: "Comment Added"});

};

export const get_comment_by_post = async (req, res) => {

   const { post_id } = req.query;

   const post = await Post.findOne({ _id: post_id});
    if( !post) {
        return res.status(404).json({ message: "Pott not found"});
    }

   const comments = await Comment.find({ postId: post_id }).populate("userId", 'name email username profilePicture');
   return res.json({ comments: comments.reverse()});
};

export const delete_commment_of_user = async (req, res) => {

    const { token, comment_id} = req.body;
    const user = await User.findOne({ token }).select("_id");
    
    if( !user ) {
        return res.status(404).json({ message: "User not found"});
    }

    const comment = await Comment.findOne({ '_id': comment_id});
    if( !comment ) {
        return res.status(404).json({ message: "Comment not found"});
    }

    if( comment.userId.toString() !== user._id.toString()) {
        return res.status(401).json({ message: "Unauthorised request"})
    }

    await comment.deleteOne({"_id": comment_id});
    return res.json({ message: "Comment Deleted"});
};

export const increament_likes = async (req, res) => {
    const { post_id } = req.body;

    const post = await Post.findOne({"_id": post_id});
    if( !post ) {
        return res.status(404).json({ message: "Post not found"});
    }

    post.likes+=1;
    await post.save();

    return res.json({ message: "Likes Increamented"});

}



