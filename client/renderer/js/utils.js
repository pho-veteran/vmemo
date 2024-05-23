// Greeting message
const getGreetingMessage = (currentHour) => {
    let greetingMessage = '';
    let greetingIcon = '';
    if (currentHour >= 0 && currentHour < 12) {
        greetingMessage = 'Good morning';
        greetingIcon = '<i class="fas fa-coffee greeting__icon"></i>';
    } else if (currentHour >= 12 && currentHour < 17) {
        greetingMessage = 'Good afternoon';
        greetingIcon = '<i class="fas fa-sun greeting__icon"></i>';
    } else {
        greetingMessage = 'Good evening';
        greetingIcon = '<i class="fas fa-moon greeting__icon"></i>';
    }
    let innerHTML = `
    <div class="greeting__title">
        <span>${greetingMessage}</span>
        ${greetingIcon}
    </div>
    `;
    return innerHTML;
}

// Active notebook
var lastActiveNotebook = null;

const activeNotebook = (notebook) => {
    if (lastActiveNotebook) {
        lastActiveNotebook.classList.remove('notebook-item--active');
    }
    lastActiveNotebook = notebook;
    notebook.classList.add('notebook-item--active');
}

// Make element editable
const makeElementEditable = (element) => {
    element.contentEditable = true;
    element.focus();
}

// generate ID
const generateID = () => {
    return new Date().getTime().toString();
}

// get relative time
const getRelativeTime = (time) => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - time;
    let minute = Math.floor(timeDifference / 60000);
    let hour = Math.floor(minute / 60);
    let day = Math.floor(hour / 24);
    return minute < 1 ? 'Just now' : minute < 60 ? `${minute}m ago` : hour < 24 ? `${hour}h ago` : `${day}d ago`;
}

// Validate form input
const validateFormInput = (input, regex) => {
    return regex.test(input);
}
const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,20}$/;
    return validateFormInput(username, usernameRegex);
}
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validateFormInput(email, emailRegex);
}
const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return validateFormInput(password, passwordRegex);;
}
export { 
    getGreetingMessage,
    activeNotebook,
    makeElementEditable,
    generateID,
    getRelativeTime,
    validateEmail,
    validatePassword,
    validateUsername
}