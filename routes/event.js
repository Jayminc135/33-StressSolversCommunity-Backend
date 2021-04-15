const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verifyToken = require("../auth/verifyToken.js");
const Event = require("../models/event");
const router = express.Router();


router.get('/',async (req,res)=>{
    let events = await Event.find().exec();

    res.send(events);
})


router.post('/insert',async (req,res)=>{
    let {name,link,isQuiz,startDate,endDate} = req.body;

    startDate = new Date(startDate);
    endDate = new Date(endDate);
    isQuiz = isQuiz == 'true';
    if(true){
        let event  = new Event({
            name,
            link,
            isQuiz,
            startDate,
            endDate
        })

        await event.save();

        res.send("Event saved");
    }
    else{
        res.status(401).send("Not authorized to create event");
    }
})


module.exports = router