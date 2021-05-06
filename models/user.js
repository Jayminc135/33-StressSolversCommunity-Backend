const mongoose = require('mongoose')
const { schema } = require('./comment')

const userSchema = mongoose.Schema({
    username:String,
    email: String,
    isAdmin : Boolean,
},{ timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('User', userSchema)