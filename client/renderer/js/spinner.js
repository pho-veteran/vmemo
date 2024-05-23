const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export const spinner = () => {
    let spinnerElement = document.createElement('div')
    spinnerElement.classList.add('spinner');
    let modalOverlayElement = $(".modal-overlay");
    const start =  () => {
        modalOverlayElement.classList.add("modal-overlay--active");
        modalOverlayElement.style.zIndex = "999";
        document.body.appendChild(spinnerElement);
    };
    const stop = () => {
        modalOverlayElement.classList.remove("modal-overlay--active");
        modalOverlayElement.style.zIndex = "5";
        document.body.removeChild(spinnerElement);
    };
    return {
        start,
        stop
    }    
}