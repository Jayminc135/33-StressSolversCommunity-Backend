const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    startDate:{type:Date,require:true},
    endDate:{type:Date,require:true},
    name:{type:String,require:true},
    isQuiz: {type:Boolean,require:true},
    link: String
},{ timestamps: { createdAt: 'created_at' } })


module.exports = mongoose.model('Event', eventSchema)