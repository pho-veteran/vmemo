const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import { 
    getGreetingMessage,
    activeNotebook,
    generateID
} from "./utils.js";
import { renderer } from "./renderer.js";
import { db } from "./db.js";
import { getAccountInLocalStorage, logout } from "./account.js";
import { loginModal, notebookModalEditor, registerModal, updateAccountInfoModal, updatePasswordModal } from "./modal.js";
import { spinner } from "./spinner.js";

const accountActionButton = $("#account-action");
const accountActionText = accountActionButton.querySelector(".account-action__title");
const accountID = getAccountInLocalStorage();
if (accountID) {
    const spinnerElement = spinner();
    spinnerElement.start();
    db.get.account()
    .then((account) => {
        if (account !== null) {
            const accountNameElement = $(".account-info__name");
            const accountEmailElement = $(".account-info__email");
            accountNameElement.textContent = account.username;
            accountEmailElement.textContent = account.email;
        } else {
            localStorage.removeItem("accountID");
            localStorage.removeItem("noteKeeperDB");
        }
    });
    spinnerElement.stop();
}
if (!getAccountInLocalStorage()) {
    accountActionButton.style.display = "flex";
    $(".account-info__name").textContent = "Guest";
    $(".account-info__email").textContent = "All data will be saved locally";
    accountActionText.textContent = "Sign in to keep your notes";
    accountActionButton.addEventListener("click", () => {
        loginModal();
    });
}

//Toggle sidebar
const sidebar = $(".navbar");
const sidebarOverlay = $("#sidebar-overlay");
const sidebarToggler = $("#sidebar-toggler");
const sidebarClose = $("#sidebar-close");
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("navbar--active");
    sidebarOverlay.classList.toggle("sidebar-overlay--active");
});
sidebarClose.addEventListener("click", () => {
    sidebar.classList.toggle("navbar--active");
    sidebarOverlay.classList.toggle("sidebar-overlay--active");
});
sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.toggle("navbar--active");
    sidebarOverlay.classList.toggle("sidebar-overlay--active");
});

//Show greeting message
const greetingTitleElement = $(".greeting__title");
const currentHour = new Date().getHours();
greetingTitleElement.innerHTML = getGreetingMessage(currentHour);

// Show current date
const currentDateElement = $("#date");
currentDateElement.textContent = new Date().toDateString().replace(" ", ", ");

//Add setting button event listener
const settingButtonElement = $("#settings-btn");
const settingBodyElement = $("#settings-body");
settingButtonElement.addEventListener("click", () => {
    settingBodyElement.classList.toggle("settings-body--active");
});
if (getAccountInLocalStorage()) {
    settingBodyElement.innerHTML = `
    <ul class="settings-list">
        <li class="settings-list__header" account-settings>Account Setting</li>
        <li class="settings-list__item" id="settings__change-info" account-settings>Change Infomation</li>
        <li class="settings-list__item" id="settings__change-password" account-settings>Change Password</li>
        <li class="settings-list__item" id="settings__log-out" account-settings>Log out</li>
    </ul>
    `
    const changeInfoButton = $("#settings__change-info");
    changeInfoButton.addEventListener("click", async () => {
        const spinnerElement = spinner();
        spinnerElement.start();
        const account = await db.get.account();
        spinnerElement.stop();
        updateAccountInfoModal(account.username, account.email);
        settingBodyElement.classList.toggle("settings-body--active");
    });
    const changePasswordButton = $("#settings__change-password");
    changePasswordButton.addEventListener("click", () => {
        updatePasswordModal();
        settingBodyElement.classList.toggle("settings-body--active");
    });
    const logOutButton = $("#settings__log-out");
    logOutButton.addEventListener("click", () => {
        logout();
        settingBodyElement.classList.toggle("settings-body--active");
    });
} else {
    settingBodyElement.innerHTML = `
    <ul class="settings-list">
        <li class="settings-list__header" account-settings>Account Setting</li>
        <li class="settings-list__item" id="settings__log-in" account-settings>Log in</li>
        <li class="settings-list__item" id="settings__register" account-settings>Register</li>
    </ul>
    `
    const logInButton = $("#settings__log-in");
    logInButton.addEventListener("click", () => {
        loginModal();
        settingBodyElement.classList.toggle("settings-body--active");
    });
    const registerButton = $("#settings__register");
    registerButton.addEventListener("click", () => {
        registerModal();
        settingBodyElement.classList.toggle("settings-body--active");
    });
}
// CRUD operations, save to localStorage first, handle server later

// Create Notebook

const createNotebookButtonElement = $("#add-notebook");
const notebookPanelTitleElement = $("#notebook-title--panel");
const showNotebookModal = () => {
    notebookModalEditor("")
    .then((notebookTitle) => {
        if (notebookTitle) {
            createNotebook(notebookTitle);
        }
    });
};

const createNotebook = async (title) => {
    const newNotebookData = await db.post.notebook({
        id: generateID(),
        title: title,
        notes: []
    });
    
    activeNotebook(renderer.notebook.createNotebook(newNotebookData));
    notebookPanelTitleElement.textContent = newNotebookData.title;
    renderExistedNotes();
};
createNotebookButtonElement.addEventListener("click", showNotebookModal);

// Render existing notebooks
const renderExistedNotebooks = async () => {
    let spinnerElement = spinner();
    spinnerElement.start();
    const notebooks = await db.get.notebooks();
    renderer.notebook.renderExistedNotebooks(notebooks);
    spinnerElement.stop();
};

//First time note render
const renderExistedNotesFirstTime = async () => {
    await renderExistedNotebooks();
    const activeNotebook = $(".notebook-item--active");
    if (activeNotebook) {
        const activeNotebookId = activeNotebook.getAttribute("notebook-id");
        let spinnerElement = spinner();
        spinnerElement.start();
        const notes = await db.get.note(activeNotebookId);
        renderer.note.renderExistedNotes(notes);
        spinnerElement.stop();
    }
}
// Render existing notes
const renderExistedNotes = async () => {
    const activeNotebook = $(".notebook-item--active");
    if (activeNotebook) {
        const activeNotebookId = activeNotebook.getAttribute("notebook-id");
        let spinnerElement = spinner();
        spinnerElement.start();
        const notes = await db.get.note(activeNotebookId);
        renderer.note.renderExistedNotes(notes);
        spinnerElement.stop();
    }
}
renderExistedNotesFirstTime();