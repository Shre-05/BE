const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/speechapp")
.then(()=>console.log("MongoDB Connected"))
.catch(err=>console.log(err));

// User Schema
const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  role: String
});
// Message Schema
const Message = mongoose.model("Message", {
  text: String
});


// Register API
app.post("/register", async (req,res)=>{
  const hashed = await bcrypt.hash(req.body.password,10);

  await User.create({
    name:req.body.name,
    email:req.body.email,
    password:hashed,
    role:req.body.role
  });

  res.json({message:"Registered Successfully"});
});

// Login API
app.post("/login", async (req,res)=>{
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.json({message:"User not found"});

  const match = await bcrypt.compare(req.body.password,user.password);
  if(!match) return res.json({message:"Wrong password"});

  res.json({message:"Login Successful", role:user.role});
});

// Save Speech Text API
app.post("/saveText", async (req,res)=>{
  await Message.create({
    text: req.body.text
  });
  res.json({ message: "Saved" });
});


app.listen(5000, ()=>{
  console.log("Server running on port 5000");
});
