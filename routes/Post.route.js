const express = require("express");
const { PostModel } = require("../models/Post.model");
const PostRouter = express.Router();

PostRouter.get("/", async (req, res) => {
    const userID = req.body.userID;
    try {
        const posts = await PostModel.find({userID: userID});
        res.send(posts)
    } catch(err) {
        console.log(err);
        res.send({"msg": "Something went wrong", "error": err.message});
    }
})

PostRouter.get("/top", async (req, res) => {
    const userID = req.body.userID;
    try {
        const post = await PostModel.findOne({userID: userID}).sort({no_of_comments: -1});
        res.send(post)
    } catch(err) {
        console.log(err);
        res.send({"msg": "Something went wrong", "error": err.message});
    }
})

PostRouter.post("/create", async (req, res) => {
    const payload = req.body;
    try {
        const new_post = new PostModel(payload);
        await new_post.save();
        res.send({"msg": "New Post Created"})
    }catch(err) {
        console.log(err);
        res.send({"msg": "Something went wrong", "error": err.message});
    }
})

PostRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body;
    const id = req.params.id;
    const post = await PostModel.findOne({"_id": id});
    const userID_post = post.userID;
    const userID_req = req.body.userID;
    try {
        if(userID_post !== userID_req) {
            res.send({"msg": "You are not authorized"});
        } else {
            await PostModel.findByIdAndUpdate({"_id":id}, payload);
            res.send("Post updated");
        }
    } catch(err) {
        console.log(err);
        res.send({"msg": "Something went wrong"})
    }
})

PostRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id;
    const post = await PostModel.findOne({"_id": id});
    const userID_post = post.userID;
    const userID_req = req.body.userID;
    try {
        if(userID_post !== userID_req) {
            res.send({"msg": "You are not authorized"});
        } else {
            await PostModel.findByIdAndDelete({"_id":id});
            res.send("Post deleted");
        }
    } catch(err) {
        console.log(err);
        res.send({"msg": "Something went wrong"})
    }
})

module.exports = {PostRouter}