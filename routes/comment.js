const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const verifytoken = require("../auth/verifyToken.js");
const router = express.Router();
const Comment = require("../models/comment");
const User = require("../models/user");

router.post("/", verifytoken, (req, res, next) => {
	let {blogId, commentText} = req.body;

	commentObj = new Comment({
		_id: new mongoose.Types.ObjectId(),
		"blogId": blogId,
		"commentText": commentText,
		"email": req.user
	});

	commentObj.save().then(result => {
		console.log(result);
		res.status(200).json({
			message: "Comment saved successfully!",
			commentSaved: commentObj
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			message: "could not save comment",
			error: err
		});
	});
});

router.get("/:blogId", verifytoken, (req, res, next) => {
	Comment.find({ "blogId": req.params.blogId })//query
	.exec()
	.then(comments => {
		emailIds = comments.map(comment => comment.email);
		userMap = {};
		User.find({ "email": emailIds })
		.exec()
		.then(users => {
			users.map(user => userMap[user.email] = user.username);
			commentsToReturn = [];
			comments.map(comment => {
				commentsToReturn.push(Object.assign(comment.toJSON(), { username: userMap[comment.email] }))
			});
			res.status(200).json({
				"comments": commentsToReturn
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

router.delete("/:commentId", verifytoken, (req, res, next) => {
	Comment.remove({_id: new mongoose.Types.ObjectId(req.params.commentId), email: req.user})
	.exec()
	.then(count => {
		if(count.n == 0){
			res.status(404).json({
				error: "comment not found or you don't have access to that comment"
			});
		}
		else{
			res.status(200).json({
				message: "comment deleted successfully!"
			});
		}
	})
	.catch(err => {
		console.log(err);
		res.status(500).json({
			error: err
		});
	});
});

module.exports = router;
