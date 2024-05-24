export const typeDefs = `#graphql
type Account {
    id: String!,
    username: String!,
    password: String!,
    email: String!,
    updatedAt: String!,
    Notebooks: [Notebook]
}
type Notebook {
    id: String!,
    title: String!,
    accountID: String!,
    updatedAt: String!,
    notes: [Note]
}
type Note {
    id: String!,
    notebookID: String!,
    title: String!,
    text: String,
    updatedAt: String!
}
type Query {
    account(id: String): Account,
    checkAccount(username: String, password: String): Account,
    checkUsername(username: String): Account,
    notebooks: [Notebook],
    getNotebooksByAccountID(accountID: String!): [Notebook],
    notes: [Note]
    getNotesByNotebookID(notebookID: String!): [Note]
}
type Mutation {
    createAccount(username: String!, password: String!, email: String!): Account,
    updateAccountInfo(accountID: String!, username: String!, email: String!): Boolean,
    updateAccountPassword(accountID: String!, oldPassword: String!, newPassword: String!): Boolean,
    createNotebook(title: String!, accountID: String!): Notebook,
    updateNotebook(id: String!, title: String!): Notebook,
    deleteNotebook(id: String!): Notebook,
    createNote(notebookID: String!, title: String!, text: String!): Note,
    updateNote(id: String!, title: String!, text: String!): Note,
    deleteNote(id: String!): Note
}
`;