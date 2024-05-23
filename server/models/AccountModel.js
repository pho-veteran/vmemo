import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    username:  {
        type: String,
        required: true,
    },
    password:  {
        type: String,
        required: true,
    },
    email:  {
        type: String,
        required: true,
    }
}, { timestamps: true });

const accountModel = mongoose.model("Account", accountSchema);
export default accountModel; 
