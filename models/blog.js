const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        ref:"users"
    },
    title:{
            type:String,
            required:true
    },
    abstraction:{
            type:String
    },
    blog:{
        type:String,
        required:true
    }
},{ timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('Blog', blogSchema)