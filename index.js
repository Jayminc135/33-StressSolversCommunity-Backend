const express = require('express')
const app = express()
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cors = require("cors");
const User = require("./models/user")
require('dotenv').config()

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{
    console.log("DB connected")
  }).catch((error)=>{
    console.log("mondb not connected");
    console.log(error);
});

const commentRoute = require("./routes/comment.js");
app.use("/comment", commentRoute);
app.use('/blog',require('./routes/blog'));

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
  
app.use((err,req,res,next)=>{
    //console.log(err);
    res.status(422).send({error:err.message});
});

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})