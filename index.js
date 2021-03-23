const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./user")
require('dotenv').config()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


function authToken(req, res, next) {
    console.log("REQ HEADERS", req.headers);
    const authHeader = req.headers["authorization"];
    console.log(authHeader);
    const token = authHeader && authHeader.split(" ")[1];
    console.log(token);
    if (token == null) {
      res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
  
      req.user = user;
      next();
    });
  }

mongoose.connect(process.env.MONGODB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB connected")
})
app.post("/signIn", async (req, res) => {
  let { email } = req.body;
  let user = await User.findOne({ email: email}).exec();

  if (user) {
    const accessToken = jwt.sign(user.email, process.env.ACCESS_SECRET_KEY);
    res.json({ accessToken: accessToken });
  } else {
    res.send("Couldnot find user");
  }
});

app.post("/signUp", async (req, res) => {
    let { username, email} = req.body;
  
    const emailExist = await User.findOne({ email: email }).exec();
  
    if (emailExist) {
      res.send("Email already exist");
    } else {
      
        const user = new User({
          username: username,
          email: email
        });
  
        await user.save();
        const accessToken = jwt.sign(
          user.email,
          process.env.ACCESS_SECRET_KEY
        );
        res.json({ accessToken: accessToken });
      
    }
  });
  

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})