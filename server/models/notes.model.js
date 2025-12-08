import mongoose from "mongoose";


const noteSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    title:{
        type:String,
        required:true,
        trim:true,
        minLength: 2,
        maxLength : 60,
    },
    content:{
        type:String,
        required : true,
        trim : true,
        minLength : 0,
        maxLength : 1000,
    },
    tags:[String]
},{timestamps : true})

const Note = mongoose.model("Note",noteSchema);

export default Note;

