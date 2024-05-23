import { request } from './request.js';
import { spinner } from './spinner.js';

const getAccountInLocalStorage = () => {
    return JSON.parse(localStorage.getItem('accountID'));
};
const login = async (username, password) => {
    const query = `
        query login($username: String, $password: String) {
            checkAccount(username: $username, password: $password) {
                id,
                username,
                email
            }
        }
    `;
    const variables = { username, password };
    try {
        const spinnerElement = spinner();
        spinnerElement.start();
        const data = await request(query, variables);
        const loginStatus = data.data.checkAccount !== null;
        if (loginStatus) {
            localStorage.setItem('accountID', JSON.stringify(data.data.checkAccount.id));
            localStorage.removeItem("noteKeeperDB");
            window.location.reload();
        } 
        spinnerElement.stop();
        return loginStatus;
    } catch (error) {
        console.error("Login failed:", error);
        return false;
    }
};
const register = async (username, password, email) => {
    const query = `
        mutation CreateAccount($username: String!, $password: String!, $email: String!) {
            createAccount(username: $username, password: $password, email: $email) {
                id
                username
                email
            }
        }
    `
    const variables = { username, password, email };
    try {
        const spinnerElement = spinner();
        spinnerElement.start();
        const data = await request(query, variables);
        const registerStatus = data.data.createAccount !== null;
        if (registerStatus) {
            localStorage.setItem('accountID', JSON.stringify(data.data.createAccount.id));
            localStorage.removeItem("noteKeeperDB");
            window.location.reload();
        }
        spinnerElement.stop();
        return registerStatus;
    } catch (error) {
        console.error("Registration failed:", error);
        return false;
    }
}
const logout = () => {
    localStorage.removeItem('accountID');
    window.location.reload();
}
export {
    getAccountInLocalStorage,
    login,
    register,
    logout
}