const mongoose = require('mongoose')

const Requests = mongoose.model('Req', {
   
    to: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    for: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'task'
    },
    message:{
        type:String,
    },
    approved:{
        type:Boolean,
    }
    
    
    
})

module.exports = Requests