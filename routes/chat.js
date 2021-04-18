const router = require("./comment");
const mongoose = require("mongoose");
const User = require("../models/user");
const socketIO = require("socket.io");
const users = {};

router.post("/getFriendsChat", function(request, result) {
    var _id = request.fields._id;
    database.collection("users").findOne({
        "email" : request.fields.email
    }, function(error, user) {
        if(user == null) {
            result.json({
                "status": "error",
                "message": "User has been logged out. Please Login again"
            });
        }
        else {
            var index = user.friends.findIndex(function(friend) {
                return friend._id == _id; 
            });
            var inbox = user.friends[index].inbox;
            result.json({
                "status": "success",
                "message": "Record has been fetched",
                "data": inbox
            });
        }
    });
});

router.post("/sendMessage", function(request, result) {
    var _id = requests.fields._id;
    var message = request.fields.message;

    database.collection("users").findOne({
        "email" : request.fields.email
    }, function(error, user) {
        if(user == null) {
            result.json({
                "status": "error",
                "message": "User has been logged out. Please Login again"
            });
        }
        else {
            var me = user;
            database.collection("users").findOne({
                "_id": ObjectId(_id)
            } ,function(error, user) {
                if(user == null) {
                    result.json({
                        "status": "error",
                        "message": "User has been logged out. Please Login again"
                    });
                }
                else {
                    database.collection("users").updateOne({
                        $and: [{
                            "_id": ObjectId(_id)
                        }, {
                            "friends._id": me._id
                        }]
                    }, {
                        $push: {
                            "friends.$.inbox": {
                                "_id": ObjectId(),
                                "message": message, 
                                "from" : me._id
                            }
                        }
                    }, function(error, data) {
                        database.collection("users").updateOne({
                            $and: [{
                                "_id": me._id
                            }, {
                                "friends._id": user._id
                            }]
                        }, {
                            $push: {
                                "friends.$.inbox": {
                                    "_id": ObjectId(),
                                    "message": message, 
                                    "from" : me._id
                                }
                            }
                        }, function(error, data) {

                            socketIO.to(users[user._id]).emit("messageRecieved", {
                                "message": message,
                                "from": me._id
                            })

                            result.json({
                                "status": "success",
                                "message": "Message has been sent."
                            });
                        });
                    });
                }
            });
        }
    });
});

router.post("/connectSocket", function(request, result) {
    database.collection("users").findOne({
        "email" : request.fields.email
    }, function(error, user) {
        if(user == null) {
            result.json({
                "status": "error",
                "message": "User has been logged out. Please Login again"
            });
        }
        else {
            users[user._id] = socketID;
            result.json({
                "status": "status",
                "message": "Socket has been connected"
            });
        }
    });
});