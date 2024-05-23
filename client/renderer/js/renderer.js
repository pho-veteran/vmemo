import { navItem } from "./navItem.js";
import { activeNotebook } from "./utils.js";
import { noteCard, addNoteCard } from "./noteCard.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export const renderer = {
    notebook: {
        ifNotebookListEmpty() {
            const notebooksListElement = $("#notebooks-list");
            const notesListWrapperElement = $(".notes-list-wrapper");
            const emptyNotebookMessageElement = document.querySelector(".empty-tooltip");
            if (notebooksListElement.children.length === 0) {           
                notesListWrapperElement.style.display = "none";
                emptyNotebookMessageElement.classList.add("empty-tooltip--active");
            } else {
                notesListWrapperElement.style.display = "block";
                emptyNotebookMessageElement.classList.remove("empty-tooltip--active");
            }
        },
        createNotebook(notebookData) {
            const notebooksListElement = $("#notebooks-list");
            let notebookElement = navItem(notebookData.title, notebookData.id);
            notebooksListElement.appendChild(notebookElement);

            this.ifNotebookListEmpty();
            return notebookElement;
        },
        renderExistedNotebooks(notebooks) {
            const notebooksListElement = $("#notebooks-list");
            const notebookPanelTitleElement = $("#notebook-title--panel");
            notebooks.forEach((notebook, index) => {
                let notebookElement = navItem(notebook.title, notebook.id);
                notebooksListElement.appendChild(notebookElement);
                if (index === 0) {
                    activeNotebook(notebookElement);
                    notebookPanelTitleElement.textContent = notebook.title;
                }
            });
            this.ifNotebookListEmpty();
        },
        updateNotebook(notebookId, notebookTitle) {
            const notebooksListElement = $("#notebooks-list");
            let oldNotebookElement = document.querySelector(
                `.notebook-item[notebook-id="${notebookId}"]`
            );
            let newNotebookElement = navItem(notebookTitle, notebookId);
            notebooksListElement.replaceChild(
                newNotebookElement,
                oldNotebookElement
            );
            activeNotebook(newNotebookElement);
        },
        deleteNotebook(notebookId) {
            const notebookElement = document.querySelector(
                `.notebook-item[notebook-id="${notebookId}"]`
            );
            if (notebookElement.classList.contains("notebook-item--active")) {
                const nextNotebook = notebookElement.nextElementSibling ?? notebookElement.previousElementSibling;
                if (nextNotebook) {
                    nextNotebook.click();
                }
            }
            notebookElement.remove();
            this.ifNotebookListEmpty();
        }
    },
    note: {
        addNote(noteData) {
            const notesListElement = $("#notes-list");
            let noteElement = noteCard(noteData);
            //append noteelement after add-note card
            notesListElement.insertBefore(noteElement, notesListElement.children[1]);
        },
        renderExistedNotes(notes) {
            const notesListElement = $("#notes-list");
            notesListElement.innerHTML = "";
            notesListElement.appendChild(addNoteCard());
            notes.forEach((note) => {
                let noteElement = noteCard(note);
                notesListElement.appendChild(noteElement);
            });
        },
        updateNote(noteId, updatedData) {
            const noteElement = document.querySelector(
                `.note-item[note-id="${noteId}"]`
            );
            let updatedNoteElement = noteCard(updatedData);
            noteElement.replaceWith(updatedNoteElement);
        },
        deleteNote(noteId) {
            const noteElement = document.querySelector(
                `.note-item[note-id="${noteId}"]`
            );
            noteElement.remove();
        }
    }
};
