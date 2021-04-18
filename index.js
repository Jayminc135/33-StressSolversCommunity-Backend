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
const events = require("./routes/event")
app.use("/comment", commentRoute);
app.use('/blog',require('./routes/blog'));
app.use('/event',events)

app.post("/signIn", async (req, res) => {
  let { email,username } = req.body;
  

  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const validEmail =  re.test(email.toLowerCase());

  if(validEmail){
    let user = await User.findOne({ email: email}).exec();
  if (user) {
    const accessToken = jwt.sign(user.email, process.env.ACCESS_SECRET_KEY);
    res.json({ accessToken: accessToken });
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
  }else{
    res.send("Invalid Email")
  }
});
  
app.use((err,req,res,next)=>{
    //console.log(err);
    res.status(422).send({error:err.message});
});

app.listen(port,()=>{
    console.log(`Listening to port ${port}`)
})