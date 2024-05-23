import { accountModel, noteModel, notebookModel } from "../models/index.js"

export const resolvers = {
    Query: {
        account: async (parent, args) => {
            const account = await accountModel.findById(args.id);
            return account;
        },
        checkAccount: async (parent, args) => {
            const account = await accountModel.findOne({
                username: args.username,
                password: args.password
            });
            return account;
        },
        checkUsername: async (parent, args) => {
            const account = await accountModel.findOne({
                username: args.username
            });
            return account;
        },
        notebooks: async () => {
            const notebooks = await notebookModel.find();
            return notebooks;
        },
        getNotebooksByAccountID: async (parent, args) => {
            const notebooks = await notebookModel.find({
                accountID: args.accountID
            });
            return notebooks;
        },
        notes: async () => {
            const notes = await noteModel.find();
            return notes; 
        },
        getNotesByNotebookID: async (parent, args) => {
            const notes = await noteModel.find({
                notebookID: args.notebookID
            });
            notes.reverse();
            return notes;
        },
    },
    Account: {
        Notebooks: async (parent) => {
            const notebooks = await notebookModel.find({
                accountID: parent.id
            });
            return notebooks;
        },
    },
    Notebook: {
        notes: async (parent) => {
            const notes = await noteModel.find({
                notebookID: parent.id
            });
            return notes;
        },
    },
    Mutation: {
        createAccount: async (parent, args) => {
            const newAccount = new accountModel({
                username: args.username,
                password: args.password,
                email: args.email,
            });
            //check username is existed, if not then save
            const checkAccount = await accountModel.findOne({
                username: args.username
            });
            if (checkAccount) {
                return null;
            } else {
                await newAccount.save();
                return newAccount;
            }
        },
        createNotebook: async (parent, args) => {
            const newNotebook = new notebookModel({
                title: args.title,
                accountID: args.accountID,
            });
            await newNotebook.save();
            return newNotebook;
        },
        updateNotebook: async (parent, args) => {
            const updatedNotebook = await notebookModel.findByIdAndUpdate(
                args.id,
                { title: args.title },
                { new: true }
            );
            return updatedNotebook;
        },
        deleteNotebook: async (parent, args) => {
            const deletedNotebook = await notebookModel.findByIdAndDelete(args.id);
            return deletedNotebook;
        },
        createNote: async (parent, args) => {
            const newNote = new noteModel({
                notebookID: args.notebookID,
                title: args.title,
                text: args.text,
            });
            await newNote.save();
            return newNote;
        },
        updateNote: async (parent, args) => {
            const updatedNote = await noteModel.findByIdAndUpdate(
                args.id,
                { title: args.title, text: args.text },
                { new: true }
            );
            return updatedNote;
        },
        deleteNote: async (parent, args) => {
            const deletedNote = await noteModel.findByIdAndDelete(args.id);
            return deletedNote;
        }
    },
};