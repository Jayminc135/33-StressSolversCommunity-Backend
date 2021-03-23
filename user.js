const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    username:String,
    email: String,
},{ timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('User', userSchema)