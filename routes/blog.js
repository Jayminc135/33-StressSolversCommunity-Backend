const verify = require('../auth/verifyToken');
const express = require('express');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');

const User = require('../models/user');

const router = express.Router();


router.post('/createblog', verify, async (req, res, next) => {

    const user = await User.findOne({email:req.user}).exec();

    console.log(user)

    if(!user){
        res.send("Invalid user");
        console.log(user)
    }

    const bloginstance = new Blog({
        title: req.body.title,
        blog: req.body.blog,
        username: user.username?user.username:req.user,
        email: req.user,
        abstraction:req.body.abstraction
    });

    bloginstance.save().then(() => {
        res.send(bloginstance);
    }).catch(next);

});


router.delete('/deleteblog/:id', verify, (req, res, next) => {

    Blog.findOne({ _id: req.params.id }).then((blog) => {
        if (!blog) {
            res.status(400).json({
                error: "Blog doesn't exit"
            });
        }
        else if (blog.email != req.user) {
            res.status(400).json({
                error: "You don't have access to this blog"
            });
        }
        else {
            Blog.findByIdAndRemove({ _id: req.params.id }).then((blog) => {
                console.log('deleted');
                res.send(blog);
            }).catch(next);
        }
    }).catch(next);

});


router.put('/updateblog/:id', verify, (req, res, next) => {

    Blog.findOne({ _id: req.params.id }).then((blog) => {
        if (!blog) {
            res.status(400).json({
                error: "Blog doesn't exit"
            });
        }
        else if (blog.email != req.user) {
            res.status(400).json({
                error: "You don't have access to this blog"
            });
        }
        else {
            Blog.findByIdAndUpdate({ _id: req.params.id }, req.body).then((blog) => {
                console.log('Updated');
                Blog.findOne({ _id: req.params.id }).then((blog) => {
                    res.send(blog);
                }).catch(next);
            }).catch(next);
        }
    }).catch(next);
});

router.get('/viewblog', verify, (req, res, next) => {

    Blog.find({}).then((blog) => {
        var blogs = []
        blog.forEach((blog) => {
            blogs.push({ "id":blog._id,"username": blog.username, "Date":blog.created_at,"title": blog.title, "Abstraction":blog.abstraction,"blog": blog.blog });
        })
        res.send(blogs);
    }).catch(next);
});

router.get('/viewblog/:id', verify, (req, res, next) => {

    Blog.findOne({ _id: req.params.id }).then((blog) => {
        if (!blog) {
            res.status(400).json({
                error: "Blog doesn't exit"
            });
        }
        else {
                res.send({ "username": blog.username, "Date":blog.created_at,"title": blog.title, "Abstraction":blog.abstraction,"blog": blog.blog });
        }
    }).catch(next);

});

module.exports = router;