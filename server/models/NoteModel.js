import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    notebookID:  {
        type: String,
        required: true,
    },
    title:  {
        type: String,
        required: true,
    },
    text:  {
        type: String,
    }
}, { timestamps: true });

const noteModel = mongoose.model("Note", noteSchema);
export default noteModel; 
