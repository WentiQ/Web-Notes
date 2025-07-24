// script.js

document.addEventListener("DOMContentLoaded", () => {
  const notesList = document.getElementById("notesList");
  const newNoteInput = document.getElementById("newNoteInput");
  const addRootNoteBtn = document.getElementById("addRootNoteBtn");

  // Utility to create a new note node
  function createNoteNode(text) {
    const li = document.createElement("li");
    li.className = "node";

    // Label Section
    const label = document.createElement("div");
    label.className = "label";
    const title = document.createElement("span");
    title.textContent = text;

    // Buttons
    const actions = document.createElement("div");
    actions.className = "actions";

    const addBtn = document.createElement("button");
    addBtn.innerHTML = "➕";
    addBtn.title = "Add Subnote";
    addBtn.onclick = () => {
      const subText = prompt("Enter subnote:");
      if (subText) {
        const subNode = createNoteNode(subText);
        children.appendChild(subNode);
      }
    };

    const toggleBtn = document.createElement("button");
    toggleBtn.innerHTML = "▶️";
    toggleBtn.title = "Toggle";
    toggleBtn.onclick = () => {
      children.classList.toggle("hidden");
      toggleBtn.innerHTML = children.classList.contains("hidden") ? "▶️" : "🔽";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "🗑️";
    deleteBtn.title = "Delete";
    deleteBtn.onclick = () => {
      if (confirm("Delete this note and its subnotes?")) {
        li.remove();
      }
    };

    actions.appendChild(addBtn);
    actions.appendChild(toggleBtn);
    actions.appendChild(deleteBtn);

    label.appendChild(title);
    label.appendChild(actions);

    const children = document.createElement("ul");
    children.className = "children tree";

    li.appendChild(label);
    li.appendChild(children);

    return li;
  }

  // Add root-level note
  addRootNoteBtn.addEventListener("click", () => {
    const text = newNoteInput.value.trim();
    if (text) {
      const node = createNoteNode(text);
      notesList.appendChild(node);
      newNoteInput.value = "";
    }
  });
});
