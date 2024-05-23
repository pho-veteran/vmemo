import { generateID } from "./utils.js";
import { request } from "./request.js";
import { getAccountInLocalStorage } from "./account.js";

var db = {};
const accountID = getAccountInLocalStorage();
if (accountID) {
    db = {
        get: {
            account: async () => {
                const query = `
                    query getAccount($id: String) {
                        account(id: $id) {
                            id
                            username
                            password
                            email
                        }
                    }
                `;
                const variables = { id: accountID };
                const data = await request(query, variables);
                return data.data.account;
            },
            notebooks: async () => {
                const query = `
                    query Notebooks($accountId: String!) {
                        getNotebooksByAccountID(accountID: $accountId) {
                            id
                            accountID
                            title
                            updatedAt
                        }
                    }
                `;
                const variables = {
                    "accountId": accountID
                }
                const data = await request(query, variables);
                return data.data.getNotebooksByAccountID;
            },
            note: async (notebookID) => {
                const query = `
                    query GetNotesByNotebookID($notebookID: String!) {
                        getNotesByNotebookID(notebookID: $notebookID) {
                            id
                            notebookID
                            title
                            text
                            updatedAt
                        }
                    }
                `
                const variables = {
                    "notebookID": notebookID
                }
                const data = await request(query, variables);
                return data.data.getNotesByNotebookID;
            }
        },
        post: {
            notebook: async (notebookData) => {
                const query = `
                    mutation Mutation($title: String!, $accountId: String!) {
                        createNotebook(title: $title, accountID: $accountId) {
                            id
                            title
                        }
                    }
                `;
                const variables = {
                    "title": notebookData.title,
                    "accountId": accountID
                }
                const data = await request(query, variables);
                return data.data.createNotebook;
            },
            note: async (notebookID, noteData) => {
                const query = `
                    mutation CreateNote($notebookID: String!, $title: String!, $text: String!) {
                        createNote(notebookID: $notebookID, title: $title, text: $text) {
                            id
                            notebookID
                            title
                            text
                            updatedAt
                        }
                    }
                `
                const variables = {
                    "notebookID": notebookID,
                    "title": noteData.title,
                    "text": noteData.text
                }
                const data = await request(query, variables);
                return data.data.createNote;
            }
        },
        update: {
            notebook: (notebookID, notebookName) => {
                const query = `
                    mutation UpdateNotebook($updateNotebookID: String!, $title: String!) {
                        updateNotebook(id: $updateNotebookID, title: $title) {
                            id
                            title
                            updatedAt
                        }
                    }
                `
                const variables = {
                    "updateNotebookID": notebookID,
                    "title": notebookName
                }
                request(query, variables);
            },
            note: async (notebookID, id, noteData) => {
                const query = `
                    mutation Mutation($updateNoteId: String!, $title: String!, $text: String!) {
                        updateNote(id: $updateNoteId, title: $title, text: $text) {
                            id
                            notebookID
                            title
                            text
                            updatedAt
                        }
                    }
                `
                const variables = {
                    "updateNoteId": id,
                    "title": noteData.title,
                    "text": noteData.text
                }
                const data = await request(query, variables);
                return data.data.updateNote;
            }
        },
        delete: {
            notebook: (notebookID) => {
                const query = `
                    mutation DeleteNotebook($deleteNotebookID: String!) {
                        deleteNotebook(id: $deleteNotebookID) {
                            id
                            title
                            updatedAt
                        }
                    }
                `
                const variables = {
                    "deleteNotebookID": notebookID
                }
                request(query, variables);
            },
            note: (notebookID, id) => {
                const query = `
                    mutation DeleteNote($deleteNoteId: String!) {
                        deleteNote(id: $deleteNoteId) {
                            id
                        }
                    }
                `
                const variables = {
                    "deleteNoteId": id
                }
                request(query, variables);
            }
        }
    }
} else {
    let noteKeeperDB = {
        notebooks: [],
    };
    const initLocalDB = () => {
        const db = localStorage.getItem("noteKeeperDB");
        if (db) {
            noteKeeperDB = JSON.parse(db);
        } else {
            localStorage.setItem("noteKeeperDB", JSON.stringify(noteKeeperDB));
        }
    };
    initLocalDB();
    const readLocalDB = () => {
        noteKeeperDB = JSON.parse(localStorage.getItem("noteKeeperDB"));
    };
    const updateLocalDB = () => {
        localStorage.setItem("noteKeeperDB", JSON.stringify(noteKeeperDB));
    };
    db = {
        get: {
            notebooks: () => {
                readLocalDB();
                return noteKeeperDB.notebooks;
            },
            note: (notebookID) => {
                readLocalDB();
                const notebook = noteKeeperDB.notebooks.find(
                    (notebook) => notebook.id === notebookID
                );
                return notebook.notes;
            },
        },
        post: {
            notebook: (notebook) => {
                readLocalDB();
                noteKeeperDB.notebooks.push(notebook);
                updateLocalDB();
                return notebook;
            },
            note: (notebookID, noteData) => {
                readLocalDB();
                let notebook = noteKeeperDB.notebooks.find(
                    (notebook) => notebook.id === notebookID
                );
                let note = {
                    id: generateID(),
                    notebookID: notebook.id,
                    ...noteData,
                    updatedAt: new Date().getTime(),
                };
                notebook.notes.unshift(note);
                updateLocalDB();
                return note;
            },
        },
        update: {
            notebook: (notebookID, notebookName) => {
                readLocalDB();
                let notebook = noteKeeperDB.notebooks.find(
                    (notebook) => notebook.id === notebookID
                );
                notebook.title = notebookName;
                updateLocalDB();
            },
            note: (notebookID, id, noteData) => {
                readLocalDB();
                let notebook = noteKeeperDB.notebooks.find(
                    (notebook) => notebook.id === notebookID
                );
                let note = notebook.notes.find((note) => note.id === id);
                note.title = noteData.title;
                note.text = noteData.text;
                note.updatedAt = new Date().getTime();
                updateLocalDB();
                return note;
            },
        },
        delete: {
            notebook: (notebookID) => {
                readLocalDB();
                noteKeeperDB.notebooks = noteKeeperDB.notebooks.filter(
                    (notebook) => notebook.id !== notebookID
                );
                updateLocalDB();
            },
            note: (notebookID, id) => {
                readLocalDB();
                let notebook = noteKeeperDB.notebooks.find(
                    (notebook) => notebook.id === notebookID
                );
                notebook.notes = notebook.notes.filter((note) => note.id !== id);
                updateLocalDB();
            },
        },
    };
}

export { db };
