import { accountModel, noteModel, notebookModel } from "../models/index.js"
import { hashPassword, checkPassword } from "../serverUtils.js";

export const resolvers = {
    Query: {
        account: async (parent, args) => {
            const account = await accountModel.findById(args.id);
            return account;
        },
        checkAccount: async (parent, args) => {
            const account = await accountModel.findOne({
                username: args.username,
            });
            if (account) {
                const passwordMatch = await checkPassword(args.password, account.password);
                if (passwordMatch) {
                    return account;
                }
            }
            return null;
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
            const checkAccount = await accountModel.findOne({
                username: args.username
            });
            if (checkAccount) {
                return null;
            } else {
                const hashedPassword = await hashPassword(args.password);
                const newAccount = new accountModel({
                    username: args.username,
                    password: hashedPassword,
                    email: args.email,
                });
                await newAccount.save();
                return newAccount;
            }
        },
        updateAccountInfo: async (parent, args) => {
            const checkUsername = await accountModel.findOne({
                username: args.username
            });
            if (checkUsername && checkUsername.id !== args.accountID) {
                return false;
            } else {
                await accountModel.findByIdAndUpdate(
                    args.accountID,
                    { username: args.username, email: args.email },
                    { new: true }
                );
                return true;
            }
        },
        updateAccountPassword: async (parent, args) => {
            const account = await accountModel.findById(args.accountID);
            const passwordMatch = await checkPassword(args.oldPassword, account.password);
            if (passwordMatch) {
                const hashedPassword = await hashPassword(args.newPassword);
                await accountModel.findByIdAndUpdate(
                    args.accountID,
                    { password: hashedPassword },
                    { new: true }
                );
                return true;
            } else {
                return false;
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