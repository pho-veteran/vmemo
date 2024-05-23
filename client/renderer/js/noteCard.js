import { getRelativeTime } from "./utils.js";
import { deleteConfirmModal, noteModalEditor} from "./modal.js";
import { db } from "./db.js";
import { renderer } from "./renderer.js";
import { spinner } from "./spinner.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const noteCard = (note) => {
    const { id, notebookID, title, text, updatedAt } = note;
    let noteElement = document.createElement("li");
    noteElement.classList.add("note-item");
    noteElement.setAttribute("note-id", id);
    noteElement.innerHTML = `
        <h3 class="note-title title-clamp">${title}
        </h3>
        <p class="note-content content-clamp">${text}
        </p>
        <div class="note-status">
            <span class="note-date">${getRelativeTime(updatedAt)}</span>
            <div class="icon-btn-wrapper">
                
                <div class="icon-button note-edit-btn" id="note-delete-btn">
                    <i class="fa-solid fa-trash"></i>
                </div>
            </div>
        </div>
    `;
    const noteDeleteBtn = noteElement.querySelector("#note-delete-btn");
    // Edit note
    const editNote = () => {
        noteModalEditor(title, text, getRelativeTime(updatedAt))
        .then(async (note) => {
            if (note) {
                const spinnerElement = spinner();
                spinnerElement.start();
                const updatedData = await db.update.note(notebookID, id, note);
                renderer.note.updateNote(id, updatedData);
                spinnerElement.stop();
            }
        });
    }
    noteElement.addEventListener("click", editNote);

    // Delete note
    noteDeleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteConfirmModal(title)
        .then((isDelete) => {
            if (isDelete) {
                db.delete.note(notebookID, id);
                renderer.note.deleteNote(id);
            }
        });
    });
    return noteElement;
};
const addNoteCard = () => {
    let noteElement = document.createElement("li");
    noteElement.classList.add("note-item");
    noteElement.classList.add("add-note-item");
    noteElement.id = "add-note";
    noteElement.innerHTML = `
        <div class="icon-wrapper">
            <i class="fa-solid fa-plus add-note__icon"></i>
        </div>
    `;
    noteElement.addEventListener("click", () => {
        noteModalEditor("", "", "")
        .then(async (note) => {
            if (note) {
                const activeNotebookID = $(
                    ".notebook-item--active"
                ).getAttribute("notebook-id");
                const spinnerElement = spinner();
                spinnerElement.start();
                const noteData = await db.post.note(activeNotebookID, note);
                renderer.note.addNote(noteData);
                spinnerElement.stop();
            }
        });
    });
    return noteElement;
};
export { noteCard, addNoteCard };
