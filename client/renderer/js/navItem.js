import { activeNotebook, makeElementEditable } from './utils.js';
import { db } from './db.js';
import { renderer } from './renderer.js';
import { deleteConfirmModal, notebookModalEditor } from './modal.js';
import { spinner } from './spinner.js';

export const navItem = (title, id) => {
    const notebookPanelTitleElement = document.querySelector("#notebook-title--panel");
    let notebookElement = document.createElement("li");
    notebookElement.classList.add("notebook-item");
    notebookElement.setAttribute("notebook-id", id);
    notebookElement.innerHTML = `
                <span class="notebook-item__title title-clamp"
                                    >${title}</span>
                                <div
                                    class="icon-btn-wrapper notebook-btn-wrapper"
                                    notebook-id="${id}"
                                >
                                    <div class="icon-button" id="notebook-btn__update">
                                        <i class="fa-solid fa-pencil"></i>
                                    </div>
                                    <div class="icon-button"
                                    id="notebook-btn__delete">
                                        <i class="fa-solid fa-trash"></i>
                                    </div>
                                </div>
            `;
    notebookElement.addEventListener("click", async () => {
        if (notebookElement.classList.contains("notebook-item--active")) return;
        activeNotebook(notebookElement);
        notebookPanelTitleElement.textContent = title;
        const spinnerElement = spinner();
        spinnerElement.start();
        const notes = await db.get.note(id);
        renderer.note.renderExistedNotes(notes);
        spinnerElement.stop();
    });

    // Notebook update
    const notebookUpdateButton = notebookElement.querySelector("#notebook-btn__update");
    const notebookTitleElement = notebookElement.querySelector(".notebook-item__title");
    notebookUpdateButton.addEventListener("click", (e) => {
        notebookModalEditor(title)
        .then((newTitle) => {
            if (newTitle) {
                notebookTitleElement.textContent = newTitle;
                db.update.notebook(id, newTitle);
                renderer.notebook.updateNotebook(id, newTitle);
                notebookPanelTitleElement.textContent = newTitle;
            }
        });
    });

    // Notebook delete
    const notebookDeleteButton = notebookElement.querySelector("#notebook-btn__delete");

    notebookDeleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteConfirmModal(title)
        .then((confirm) => {
            if (confirm) {
                db.delete.notebook(id);
                renderer.notebook.deleteNotebook(id);
            }
        });
    });
    return notebookElement;
};
