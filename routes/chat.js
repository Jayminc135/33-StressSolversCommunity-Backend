const router = require("express").Router();
const Conversation = require("../models/conversations");
const Message = require("../models/message");
const verifyToken = require("../auth/verifyToken.js");
const User = require("../models/user");
const conversations = require("../models/conversations");

  
  router.get("/getConversation",verifyToken, async (req, res) => {
    try {

      const user = await User.findOne({email:req.user}).exec()
      const conversation = await Conversation.find({
        members: { $in: [user._id] },
      }).exec();

      const result = [] 
      conversation.forEach((conv)=>{        
        result.push({_id:conv._id,members:conv.members,user:user._id})
      })
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  

router.post("/addMessage", verifyToken,async (req, res) => {
  let {text,conversationId} = req.body


  const sender = await User.findOne({email:req.user}).exec()
  const newMessage = new Message({
    sender:sender._id,
    text:text,
    conversationId:conversationId
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/message/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});



  module.exports = router;
