const express = require("express");
const { UserModel } = require("../models/User.model");
const UserRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

UserRouter.get("/", async (req, res) => {
    const users = await UserModel.find();
    res.send(users);
})

UserRouter.post("/register", async (req, res) => {
    const {name, email, gender, password, age, city} = req.body;
    try {
        bcrypt.hash(password, 5, async (err, secure_password) => {
            if(err) {
                console.log(err);
            } else {
                const user = new UserModel({email, password: secure_password, name, gender, age, city});
                await user.save();
                res.send("New User Registered successfully");
            }
        });
    }catch(err) {
        res.send("Registration Error");
        console.log(err);
    }
})


UserRouter.post("/login", async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await UserModel.find({email});
        const hashed_pass = user[0].password;
        if(user.length>0) {
            bcrypt.compare(password, hashed_pass, (err, result) => {
                if(result) {
                    const token = jwt.sign({userID: user[0]._id}, process.env.key);
                    res.send({"msg": "Login Successful", "token": token});
                } else {
                    res.send("Wrong Credentials");
                }
            });
        } else {
            res.send("Wrong Credentials")
        }
    } catch(err) {
        res.send("Something went wrong");
        console.log(err);
    }
})

module.exports={UserRouter}