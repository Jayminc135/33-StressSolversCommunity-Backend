const mongoose = require('mongoose')
const InboxObject = new mongoose.Schema({
    from: String,
    message: String
})
const userSchema = mongoose.Schema({
    username:String,
    email: String,
    isAdmin : Boolean,
    friends : [new mongoose.Schema({
        inbox: [InboxObject]
    })]
},{ timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('User', userSchema)