const mongoose = require('mongoose')
const { schema } = require('./comment')
const InboxObject = new Schema({
    from: String,
    message: String
})
const userSchema = mongoose.Schema({
    username:String,
    email: String,
    isAdmin : Boolean,
    friends : [new Schema({
        inbox: [InboxObject]
    })]
},{ timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('User', userSchema)