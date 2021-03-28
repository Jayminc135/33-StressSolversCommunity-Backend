const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    email: {
    	type: String,
    	required: true,
    },
    commentText: {
    	type: String,
    	required: true,
    },
    blogId: {
    	type: String,
    	required: true,
    },
},{ timestamps: { createdAt: 'created_at' } })

module.exports = mongoose.model('Comment', commentSchema)
