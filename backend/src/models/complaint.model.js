const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    location:{
        type:String,

    },
    category:{
        type:String,
        enum:[
            "plumbing","electrical","internet","cleaning","other"
        ],
        required:true
    },
    image:{
        type:String,

    },
    status:{
        type:String,
        enum:["pending","in-progress","resolved"],
        default:"pending"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})
const complaintModel = mongoose.model("complaint",complaintSchema);

module.exports = complaintModel;