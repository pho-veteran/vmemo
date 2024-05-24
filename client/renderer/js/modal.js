import { validateEmail, validatePassword, validateUsername } from "./utils.js";
import { login, register, updateInfo, updatePassword } from "./account.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Confirm dialog modal
const deleteConfirmModal = (title) => {
    let deleteModalElement = document.createElement("div");
    let modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");
    deleteModalElement.classList.add("modal", "modal-dialog--delete");
    deleteModalElement.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">Confirm delete</h2>
            </div>
            <div class="modal-body modal-dialog__body">
                <p class="modal-dialog__content">
                    Are you sure want to delete?
                    
                </p>
                <p class="modal-dialog__title title-clamp">${title}</p>
            </div>
            <div class="modal-footer">
                <div class="modal-btn-wrapper">
                    <div class="modal-btn" id="cancel-delete">
                        <i
                            class="fa-solid fa-times btn__icon modal-btn__icon"
                        ></i>
                        <span class="btn__text">Cancel</span>
                    </div>
                    <div class="modal-btn" id="confirm-delete">
                        <i class="fa-solid fa-trash modal-btn__icon"></i>
                        <span class="btn__text">Delete</span>
                    </div>
                </div>
            </div>
            `;
    document.body.appendChild(deleteModalElement);
    const cancelDeleteButton = $("#cancel-delete");
    const confirmDeleteButton = $("#confirm-delete");
    return new Promise((resolve) => {
        cancelDeleteButton.addEventListener("click", () => {
            modalOverlayElement.classList.remove("modal-overlay--active");
            deleteModalElement.remove();
            resolve(false);
        });
        confirmDeleteButton.addEventListener("click", () => {
            modalOverlayElement.classList.remove("modal-overlay--active");
            deleteModalElement.remove();
            resolve(true);
        });
    });
};
// Notebook editor modal
const notebookModalEditor = (title) => {
    let notebookEditorModalElement = document.createElement("div");
    let modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");
    notebookEditorModalElement.classList.add("modal", "modal-notebook-editor");
    notebookEditorModalElement.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Enter your notebook name</h2>
        </div>
        <div class="modal-body">
            <input
                type="text"
                name="notebook-name"
                id="notebook-input__name"
                placeholder="Write something..."
                value="${title}"
                class="modal-input modal-notebook-input"
            />
        </div>
        <div class="modal-footer">
            <div class="modal-btn-wrapper">
                <div class="modal-btn" id="cancel-notebook">
                    <i
                        class="fa-solid fa-times btn__icon modal-btn__icon"
                    ></i>
                    <span class="btn__text">Cancel</span>
                </div>
                <div class="modal-btn" id="save-notebook">
                    <i
                        class="fa-solid fa-save btn__icon modal-btn__icon"
                    ></i>
                    <span class="btn__text">Save</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(notebookEditorModalElement);
    const titleInputElement = $("#notebook-input__name");
    const cancelNotebookButton = $("#cancel-notebook");
    const saveNotebookButton = $("#save-notebook");
    titleInputElement.addEventListener("focus", () => {
        let length = titleInputElement.value.length;
        titleInputElement.setSelectionRange(length, length);
    });
    titleInputElement.focus();
    return new Promise((resolve) => {
        cancelNotebookButton.addEventListener("click", () => {
            modalOverlayElement.classList.remove("modal-overlay--active");
            notebookEditorModalElement.remove();
            resolve(null);
        });
        saveNotebookButton.addEventListener("click", () => {
            modalOverlayElement.classList.remove("modal-overlay--active");
            notebookEditorModalElement.remove();
            const title =
                titleInputElement.value === ""
                    ? "Untitled"
                    : titleInputElement.value;
            resolve(title);
        });
        titleInputElement.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                saveNotebookButton.click();
            }
        });
    });
};
// Note editor modal
const noteModalEditor = (
    title = "Untitled",
    text = "Add your note...",
    time = ""
) => {
    const modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");
    const editorModalElement = document.createElement("div");
    editorModalElement.classList.add("modal", "modal-note-editor");
    editorModalElement.innerHTML = `
        <div class="modal-header">
            <input
                type="text"
                name="note-name"
                id="note-input__name"
                value="${title}"
                placeholder="Untitled"
                class="modal-title modal-input title-clamp"
            />
        </div>
        <div class="modal-body">
            <textarea
                name="note-content"
                id="note-input__content"
                placeholder="Write something..."
                class="modal-text-area"
            >${text}</textarea>
        </div>
        <div class="modal-footer">
            <span class="note-date note-date--modal">${time}</span>
            <div class="modal-btn-wrapper">
                <div class="modal-btn" id="cancel-note">
                    <i
                        class="fa-solid fa-times btn__icon modal-btn__icon"
                    ></i>
                    <span class="btn__text">Cancel</span>
                </div>
                <div class="modal-btn" id="save-note">
                    <i
                        class="fa-solid fa-save btn__icon modal-btn__icon"
                    ></i>
                    <span class="btn__text">Save</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(editorModalElement);
    const titleInputElement = $("#note-input__name");
    const textAreaElement = $("#note-input__content");
    const cancelNoteButton = $("#cancel-note");
    const saveNoteButton = $("#save-note");
    titleInputElement.focus();
    return new Promise((resolve) => {
        cancelNoteButton.addEventListener("click", () => {
            modalOverlayElement.classList.remove("modal-overlay--active");
            editorModalElement.remove();
            resolve(null);
        });
        saveNoteButton.addEventListener("click", () => {
            modalOverlayElement.classList.remove("modal-overlay--active");
            editorModalElement.remove();
            resolve({
                title:
                    titleInputElement.value === ""
                        ? "Untitled"
                        : titleInputElement.value,
                text: textAreaElement.value,
            });
        });
    });
};
//Login modal
const loginModal = () => {
    const modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");

    const loginModalElement = document.createElement("div");
    loginModalElement.classList.add("modal", "modal-account");
    loginModalElement.innerHTML = `
        <div class="modal-row">
            <div class="modal-account__close-btn" id="modal-account__close">
                <i class="fa-solid fa-times icon-button"></i>
            </div>
        </div>
        <div class="modal-header">
            <h2 class="modal-title">Login</h2>
        </div>
        <div class="modal-body">
            <form id="loginForm" class="form-wrapper">
                <div class="form-group">
                    <div class="input-text">
                        <input type="text" name="username" id="username" placeholder=" "/>
                        <label for="username">Username</label>
                    </div>
                    <span class="error" id="usernameError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input type="password" name="password" id="password" placeholder=" "/>
                        <label for="password">Password</label>
                    </div>
                    <span class="error" id="passwordError"></span>
                </div>
            </form>
            <div class="change-form-wrapper">
                <span>Don't have an account?
                </span>
                <a href="#!" class="change-form" id="change-form">Register</a>
            </div>
        </div>
        <div class="modal-footer">
            <div class="account-modal-btn login" id="login">
                <span class="btn__text">Login</span>
            </div>
        </div>
    `;
    document.body.appendChild(loginModalElement);
    const closeButton = $("#modal-account__close");
    const loginButton = $("#login");
    const changeForm = $("#change-form");
    closeButton.addEventListener("click", () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        loginModalElement.remove();
    });
    changeForm.addEventListener("click", () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        loginModalElement.remove();
        registerModal();
    });
    const confirmAction = () => {
        const username = $("#username").value;
        const password = $("#password").value;
        const usernameError = $("#usernameError");
        const passwordError = $("#passwordError");
        let valid = true;
        if (username === "") {
            usernameError.textContent = "Username is required";
        } else {
            if (validateUsername(username)) {
                usernameError.textContent = "";
            } else {
                usernameError.textContent =
                    "Username must be between 3 and 20 characters long";
                valid = false;
            }
        }
        if (password === "") {
            passwordError.textContent = "Password is required";
        } else {
            if (validatePassword(password)) {
                passwordError.textContent = "";
            } else {
                passwordError.textContent =
                    "Password must contain at least 8 characters, at least one letter, one number and one special character";
                valid = false;
            }
        }
        if (username !== "" && password !== "" && valid) {
            const loginStatus = login(username, password);
            loginStatus.then((status) => {
                if (!status) {
                    passwordError.textContent = "Invalid username or password";
                }
            });
        }
    };
    loginButton.addEventListener("click", confirmAction);
    const formInputs = $$("input");
    formInputs.forEach((input) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                confirmAction();
            }
        });
    });
};
// Register modal
const registerModal = () => {
    const modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");

    const registerModalElement = document.createElement("div");
    registerModalElement.classList.add("modal", "modal-account");
    registerModalElement.innerHTML = `
        <div class="modal-row">
            <div class="modal-account__close-btn" id="modal-account__close">
                <i class="fa-solid fa-times icon-button"></i>
            </div>
        </div>
        <div class="modal-header">
            <h2 class="modal-title">Register</h2>
        </div>
        <div class="modal-body">
            <form id="registerForm" class="form-wrapper">
                <div class="form-group">
                    <div class="input-text">
                        <input type="text" name="username" id="username" placeholder=" "/>
                        <label for="username">Username</label>
                    </div>
                    <span class="error" id="usernameError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input type="email" name="email" id="email" placeholder=" "/>
                        <label for="email">Email</label>
                    </div>
                    <span class="error" id="emailError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input type="password" name="password" id="password" placeholder=" "/>
                        <label for="password">Password</label>
                    </div>
                    <span class="error" id="passwordError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input type="password" name="repassword" id="repassword" placeholder=" "/>
                        <label for="repassword">Confirm Password</label>
                    </div>
                    <span class="error" id="rePasswordError"></span>
                </div>
            </form>
            <div class="change-form-wrapper">
                <span>Already have an account?
                </span>
                <a href="#!" class="change-form" id="change-form">Log in</a>
            </div>
        </div>
        <div class="modal-footer">
            <div class="account-modal-btn" id="register">
                <span class="btn__text">Register</span>
            </div>
        </div>
    `;
    document.body.appendChild(registerModalElement);
    const closeButton = $("#modal-account__close");
    const registerButton = $("#register");
    const changeForm = $("#change-form");
    closeButton.addEventListener("click", () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        registerModalElement.remove();
    });
    changeForm.addEventListener("click", () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        registerModalElement.remove();
        loginModal();
    });
    const confirmAction = () => {
        const username = $("#username").value;
        const email = $("#email").value;
        const password = $("#password").value;
        const repassword = $("#repassword").value;
        const usernameError = $("#usernameError");
        const emailError = $("#emailError");
        const passwordError = $("#passwordError");
        const repasswordError = $("#rePasswordError");
        let valid = true;
        if (username === "") {
            usernameError.textContent = "Username is required";
        } else {
            if (validateUsername(username)) {
                usernameError.textContent = "";
            } else {
                usernameError.textContent =
                    "Username must be between 3 and 20 characters long";
                valid = false;
            }
        }
        if (email === "") {
            emailError.textContent = "Email is required";
        } else {
            if (validateEmail(email)) {
                emailError.textContent = "";
            } else {
                emailError.textContent = "Invalid email address";
                valid = false;
            }
        }
        if (password === "") {
            passwordError.textContent = "Password is required";
        } else {
            if (validatePassword(password)) {
                passwordError.textContent = "";
            } else {
                passwordError.textContent =
                    "Password must contain at least 8 characters, at least one letter, one number and one special character";
                valid = false;
            }
        }
        if (repassword === "") {
            repasswordError.textContent = "Confirm password is required";
        } else if (password !== repassword) {
            repasswordError.textContent = "Passwords do not match";
        } else {
            repasswordError.textContent = "";
        }
        if (
            username !== "" &&
            email !== "" &&
            password !== "" &&
            repassword !== "" &&
            password === repassword &&
            valid
        ) {
            const registerStatus = register(username, password, email);
            registerStatus.then((status) => {
                if (!status) {
                    usernameError.textContent = "Username is already taken";
                }
            });
        }
    };
    registerButton.addEventListener("click", confirmAction);
    const formInputs = $$("input");
    formInputs.forEach((input) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                confirmAction();
            }
        });
    });
};
// const updateAccountModal = (email) => {
//     let modalOverlayElement = $(".modal-overlay");
//     modalOverlayElement.classList.add("modal-overlay--active");
//     let updateAccountModalElement = document.createElement("div");
//     updateAccountModalElement.classList.add("modal", "modal-account-update");
//     updateAccountModalElement.innerHTML = `
//         <div class="modal-header">
//             <h2 class="modal-title">Change Information</h2>
//         </div>
//         <div class="modal-body">
//             <form id="registerForm" class="form-wrapper">
//                 <div class="form-group">
//                     <div class="input-text">
//                         <input
//                             type="email"
//                             name="email"
//                             id="email"
//                             placeholder=" "
//                             value="${email}"
//                         />
//                         <label for="email">Email</label>
//                     </div>
//                     <span class="error" id="emailError"></span>
//                 </div>
//                 <div class="form-group">
//                     <div class="input-text">
//                         <input
//                             type="password"
//                             name="old-password"
//                             id="old-password"
//                             placeholder=" "
//                         />
//                         <label for="old-password">Old Password</label>
//                     </div>
//                     <span class="error" id="oldPasswordError"></span>
//                 </div>
//                 <div class="form-group">
//                     <div class="input-text">
//                         <input
//                             type="password"
//                             name="new-password"
//                             id="new-password"
//                             placeholder=" "
//                         />
//                         <label for="new-password">New Password</label>
//                     </div>
//                     <span class="error" id="newPasswordError"></span>
//                 </div>
//                 <div class="form-group">
//                     <div class="input-text">
//                         <input
//                             type="password"
//                             name="re-password"
//                             id="re-password"
//                             placeholder=" "
//                         />
//                         <label for="re-password">Confirm Password</label>
//                     </div>
//                     <span class="error" id="rePasswordError"></span>
//                 </div>
//             </form>
//         </div>
//         <div class="modal-footer">
//             <div class="modal-btn-wrapper">
//                 <div class="modal-btn" id="cancel-account">
//                     <i class="fa-solid fa-times btn__icon modal-btn__icon"></i>
//                     <span class="btn__text">Cancel</span>
//                 </div>
//                 <div class="modal-btn" id="save-account">
//                     <i class="fa-solid fa-save btn__icon modal-btn__icon"></i>
//                     <span class="btn__text">Save</span>
//                 </div>
//             </div>
//         </div>
//     `;
//     document.body.appendChild(updateAccountModalElement);

//     const cancelAccountButton = $("#cancel-account");
//     const saveAccountButton = $("#save-account");
//     const confirmAction = () => {
//         const email = $("#email").value;
//         const oldPassword = $("#old-password").value;
//         const newPassword = $("#new-password").value;
//         const rePassword = $("#re-password").value;
//         const emailError = $("#emailError");
//         const oldPasswordError = $("#oldPasswordError");
//         const newPasswordError = $("#newPasswordError");
//         const rePasswordError = $("#rePasswordError");
//         let valid = true;
//         if (email === "") {
//             emailError.textContent = "Email is required";
//         } else {
//             if (validateEmail(email)) {
//                 emailError.textContent = "";
//             } else {
//                 emailError.textContent = "Invalid email address";
//                 valid = false;
//             }
//         }
//         if (oldPassword === "") {
//             oldPasswordError.textContent = "Old password is required";
//         } else {
//             if (validatePassword(oldPassword)) {
//                 oldPasswordError.textContent = "";
//             } else {
//                 oldPasswordError.textContent =
//                     "Password must contain at least 8 characters, at least one letter, one number and one special character";
//                 valid = false;
//             }
//         }
//         if (newPassword === "") {
//             newPasswordError.textContent = "New password is required";
//         } else {
//             if (validatePassword(newPassword)) {
//                 newPasswordError.textContent = "";
//             } else {
//                 newPasswordError.textContent =
//                     "Password must contain at least 8 characters, at least one letter, one number and one special character";
//                 valid = false;
//             }
//         }
//         if (rePassword === "") {
//             rePasswordError.textContent = "Confirm password is required";
//         } else if (newPassword !== rePassword) {
//             rePasswordError.textContent = "Passwords do not match";
//             valid = false;
//         } else {
//             rePasswordError.textContent = "";
//         }
//         if (
//             email !== "" &&
//             oldPassword !== "" &&
//             newPassword !== "" &&
//             rePassword !== "" &&
//             valid
//         ) {
//             const updateStatus = update(email, newPassword);
//             updateStatus.then((status) => {
//                 if (!status) {
//                     oldPasswordError.textContent = "Wrong password";
//                 }
//             });
//         }
//     };
//     cancelAccountButton.addEventListener("click", () => {
//         modalOverlayElement.classList.remove("modal-overlay--active");
//         updateAccountModalElement.remove();
//     });
//     saveAccountButton.addEventListener("click", confirmAction);
// };

const updateAccountInfoModal = (username, email) => {
    let modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");
    let updateAccountModalElement = document.createElement("div");
    updateAccountModalElement.classList.add("modal", "modal-account-update");
    updateAccountModalElement.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Change Information</h2>
        </div>
        <div class="modal-body">
            <form id="updateForm" class="form-wrapper">
                <div class="form-group">
                    <div class="input-text">
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder=" "
                            value="${username}"
                        />
                        <label for="username">Username</label>
                    </div>
                    <span class="error" id="usernameError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder=" "
                            value="${email}"
                        />
                        <label for="email">Email</label>
                    </div>
                    <span class="error" id="emailError"></span>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <div class="modal-btn-wrapper">
                <div class="modal-btn" id="cancel-account">
                    <i class="fa-solid fa-times btn__icon modal-btn__icon"></i>
                    <span class="btn__text">Cancel</span>
                </div>
                <div class="modal-btn" id="save-account">
                    <i class="fa-solid fa-save btn__icon modal-btn__icon"></i>
                    <span class="btn__text">Save</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(updateAccountModalElement);

    const cancelAccountButton = $("#cancel-account");
    const saveAccountButton = $("#save-account");
    const confirmAction = () => {
        const username = $("#username").value;
        const email = $("#email").value;
        const usernameError = $("#usernameError");
        const emailError = $("#emailError");
        let valid = true;
        if (username === "") {
            usernameError.textContent = "Username is required";
        } else {
            if (validateUsername(username)) {
                usernameError.textContent = "";
            } else {
                usernameError.textContent =
                    "Username must be between 3 and 20 characters long";
                valid = false;
            }
        }
        if (email === "") {
            emailError.textContent = "Email is required";
        } else {
            if (validateEmail(email)) {
                emailError.textContent = "";
            } else {
                emailError.textContent = "Invalid email address";
                valid = false;
            }
        }
        if (username !== "" && email !== "" && valid) {
            const updateStatus = updateInfo(username, email);
            updateStatus.then((status) => {
                if (!status) {
                    usernameError.textContent = "Username is already taken";
                }
            });
        }
    };
    cancelAccountButton.addEventListener("click", () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        updateAccountModalElement.remove();
    });
    saveAccountButton.addEventListener("click", confirmAction);
};
const updatePasswordModal = () => {
    let modalOverlayElement = $(".modal-overlay");
    modalOverlayElement.classList.add("modal-overlay--active");
    let updatePasswordModalElement = document.createElement("div");
    updatePasswordModalElement.classList.add("modal", "modal-account-update");
    updatePasswordModalElement.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title">Change Password</h2>
        </div>
        <div class="modal-body">
            <form id="updateForm" class="form-wrapper">
                <div class="form-group">
                    <div class="input-text">
                        <input
                            type="password"
                            name="oldpassword"
                            id="oldpassword"
                            placeholder=" "
                        />
                        <label for="oldpassword">Old Password</label>
                    </div>
                    <span class="error" id="oldPasswordError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input
                            type="password"
                            name="newpassword"
                            id="newpassword"
                            placeholder=" "
                        />
                        <label for="newpassword">New Password</label>
                    </div>
                    <span class="error" id="newPasswordError"></span>
                </div>
                <div class="form-group">
                    <div class="input-text">
                        <input
                            type="password"
                            name="repassword"
                            id="repassword"
                            placeholder=" "
                        />
                        <label for="repassword">Confirm Password</label>
                    </div>
                    <span class="error" id="rePasswordError"></span>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <div class="modal-btn-wrapper">
                <div class="modal-btn" id="cancel-account">
                    <i class="fa-solid fa-times btn__icon modal-btn__icon"></i>
                    <span class="btn__text">Cancel</span>
                </div>
                <div class="modal-btn" id="save-account">
                    <i class="fa-solid fa-save btn__icon modal-btn__icon"></i>
                    <span class="btn__text">Save</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(updatePasswordModalElement);

    const cancelAccountButton = $("#cancel-account");
    const saveAccountButton = $("#save-account");
    const confirmAction = () => {
        const oldPassword = $("#oldpassword").value;
        const newPassword = $("#newpassword").value;
        const repassword = $("#repassword").value;
        const oldPasswordError = $("#oldPasswordError");
        const newPasswordError = $("#newPasswordError");
        const repasswordError = $("#rePasswordError");
        let valid = true;
        if (oldPassword === "") {
            oldPasswordError.textContent = "Old password is required";
        } else {
            if (validatePassword(oldPassword)) {
                oldPasswordError.textContent = "";
            } else {
                oldPasswordError.textContent =
                    "Password must contain at least 8 characters, at least one letter, one number and one special character";
                valid = false;
            }
        }
        if (newPassword === "") {
            newPasswordError.textContent = "New password is required";
        } else {
            if (validatePassword(newPassword)) {
                newPasswordError.textContent = "";
            } else {
                newPasswordError.textContent =
                    "Password must contain at least 8 characters, at least one letter, one number and one special character";
                valid = false;
            }
        }
        if (repassword === "") {
            repasswordError.textContent = "Confirm password is required";
        } else if (newPassword !== repassword) {
            repasswordError.textContent = "Passwords do not match";
        } else {
            repasswordError.textContent = "";
        }
        if (
            oldPassword !== "" &&
            newPassword !== "" &&
            repassword !== "" &&
            valid
        ) {
            const updateStatus = updatePassword(oldPassword, newPassword);
            updateStatus.then((status) => {
                if (!status) {
                    oldPasswordError.textContent = "Wrong password";
                } else {
                    modalOverlayElement.classList.remove("modal-overlay--active");
                    updatePasswordModalElement.remove();
                }
            });
        }
    };
    cancelAccountButton.addEventListener("click", () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        updatePasswordModalElement.remove();
    });
    saveAccountButton.addEventListener("click", confirmAction);
};
export {
    deleteConfirmModal,
    noteModalEditor,
    loginModal,
    registerModal,
    notebookModalEditor,
    updateAccountInfoModal,
    updatePasswordModal,
};
