const form = document.getElementById("noteForm");
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const notesList = document.getElementById("notesList");
const message = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");

async function loadNotes() {

    try {

        const response = await fetch("/notes");

        const notes = await response.json();

        displayNotes(notes);

    } catch (error) {

        message.textContent = "Unable to load notes.";

    }
}


function displayNotes(notes) {

    if (notes.length === 0) {

        notesList.innerHTML =
            '<div class="empty">No notes yet. Create your first note!</div>';

        return;
    }

    notesList.innerHTML = notes.map(note => `

        <div class="note-card">

            <h3>${escapeHTML(note.title)}</h3>

            <p>${escapeHTML(note.content)}</p>

            <small>
                ${new Date(note.createdAt).toLocaleString()}
            </small>

            <br><br>

            <button
                class="delete-btn"
                onclick="deleteNote('${note.id}')"
            >
                Delete
            </button>

        </div>

    `).join("");
}


async function createNote(event) {

    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !content) {

        message.textContent =
            "Please enter both title and content.";

        return;
    }

    try {

        const response = await fetch("/notes", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                title: title,
                content: content
            })

        });

        const data = await response.json();

        if (!response.ok) {

            message.textContent = data.message;

            return;
        }

        form.reset();

        message.textContent =
            "Note added successfully!";

        loadNotes();

    } catch (error) {

        message.textContent =
            "Unable to create note.";

    }
}


async function deleteNote(id) {

    try {

        const response = await fetch(`/notes/${id}`, {

            method: "DELETE"

        });

        if (response.ok) {

            loadNotes();

        } else {

            message.textContent =
                "Unable to delete note.";

        }

    } catch (error) {

        message.textContent =
            "Unable to delete note.";

    }
}


function escapeHTML(text) {

    const div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}


form.addEventListener("submit", createNote);

refreshBtn.addEventListener("click", loadNotes);

loadNotes();