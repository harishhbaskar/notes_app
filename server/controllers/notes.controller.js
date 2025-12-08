import Note from "../models/notes.model.js"

const getAllNotes = async (req , res , next) => {
    try{
        const notes = await Note.find({user:req.user._id}).lean();
        res.status(200).json(notes);
    }catch(error){
        next(error)
    }
}

const getNoteById = async (req, res , next)=> {
    try{
        const note = await Note.findOne({_id:req.params.id , user:req.user._id});
        res.status(200).json(note)
    }catch(error){
        next(error)
    }
}

const createNote = async (req  , res , next) => {
    try{
        const {title , content , tags} = req.body;

        const newNote = new Note({
            user:req.user._id,
            title : title,
            content : content,
            tags :tags,
        })

        const savedNote = await newNote.save();
        res.status(200).json(savedNote);
    }catch(error){
        next(error)
    }
}

const updateNote = async (req ,res , next) => {
    try{
        const note = await Note.findOne({_id:req.params.id , user : req.user._id});
        if(!note){
            const error = new Error("Note does not exits")
            res.statusCode = 404;
            throw error;
        }

        note.title = req.body.title || note.title;
        note.content = req.body.content || note.title;
        note.tags = req.body.tags || note.tags;

        const updatedNote = await note.save();
        res.status(200).json(updatedNote);

    }catch(error){
        next(error);
    }
}

const deleteNote = async (req , res , next )=> {
    try{
        const note = await Note.findOne({_id:req.params.id , user : req.user._id});

        if(!note){
            const error = new Error("Note does not exist");
            res.status = 404 ;
            throw error;
        }

        await note.deleteOne();
        res.status(200).json({message : "Note deleted successfully"});
    }catch(error){
        next(error);
    }
}

export {getAllNotes , getNoteById ,createNote, updateNote , deleteNote }

