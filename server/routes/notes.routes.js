import express from "express"
import { getAllNotes , getNoteById , createNote , updateNote ,deleteNote } from "../controllers/notes.controller.js"
import authorize from "../middleware/auth.middleware.js";

const notesRouter = express.Router();

notesRouter.use(authorize)

notesRouter.get("/",getAllNotes);
notesRouter.get("/:id",getNoteById);
notesRouter.post("/",createNote);
notesRouter.put("/update/:id",updateNote)
notesRouter.delete("/delete/:id",deleteNote);

export default notesRouter;