const verify = require('../auth/verifytoken');
const express = require('express');

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Blog = require('../models/blog');

const User = require('../models/user');

const router = express.Router();


router.post('/createblog', verify, (req, res, next) => {

    //console.log(req.body);

    const email = req.body.email;

    console.log(email);

    User.findOne({ email: email }).then((user) => {
        console.log(email);
        console.log(user);
        if (!user) {
            res.status(400).json({
                error: "Invalid User"
            }).catch(next);
        }
        else {
            const bloginstance = new Blog({
                title: req.body.title,
                blog: req.body.blog,
                username: req.body.username,
                email: req.body.email
            });

            bloginstance.save().then(() => {
                res.send(bloginstance);
            }).catch(next);
        }

    }).catch(next);

});


router.delete('/deleteblog/:id', verify, (req, res, next) => {

    Blog.findOne({ _id: req.params.id }).then((blog) => {
        if (!blog) {
            res.status(400).json({
                error: "Blog doesn't exit"
            });
        }
        else if (blog.email != req.body.email) {
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
        else if (blog.email != req.body.email) {
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

module.exports = router;