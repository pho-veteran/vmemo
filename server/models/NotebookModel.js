import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema({
    title:  {
        type: String,
        required: true,
    },
    accountID:  {
        type: String,
        required: true,
    },
}, { timestamps: true });

const notebookModel = mongoose.model("Notebook", notebookSchema);
export default notebookModel; 
