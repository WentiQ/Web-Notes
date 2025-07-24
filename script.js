// Collapsed left bar logic
const collapsedLeftBar = document.getElementById("collapsedLeftBar");
const openLeftSidebarBtn = document.getElementById("openLeftSidebarBtn");

function updateCollapsedLeftBar() {
  const leftClosed = leftSidebar.classList.contains("closed");
  if (leftClosed) {
    collapsedLeftBar.classList.add("visible");
  } else {
    collapsedLeftBar.classList.remove("visible");
  }
}

function toggleLeftSidebar() {
  leftSidebar.classList.toggle("closed");
  updateCollapsedLeftBar();
}

if (openLeftSidebarBtn) openLeftSidebarBtn.onclick = function() {
  leftSidebar.classList.remove("closed");
  updateCollapsedLeftBar();
};

// Initial state
document.addEventListener('DOMContentLoaded', updateCollapsedLeftBar);
const notesList = document.getElementById("notesList");
const newNoteInput = document.getElementById("newNoteInput");
const addRootNoteBtn = document.getElementById("addRootNoteBtn");
const noteBody = document.getElementById("noteBody");
const editorTitle = document.getElementById("editorTitle");
const leftSidebar = document.getElementById("leftSidebar");
const rightSidebar = document.getElementById("rightSidebar");
const rightContent = document.querySelector(".right-content");

let noteIdCounter = 0;
const noteMap = new Map(); // id -> { title, content, element }

function createNoteNode(titleText) {
  const noteId = `note-${noteIdCounter++}`;
  const noteData = { title: titleText, content: "", id: noteId };

  const li = document.createElement("li");
  li.className = "node";
  li.dataset.id = noteId;

  const label = document.createElement("div");
  label.className = "label";

  const titleSpan = document.createElement("span");
  titleSpan.textContent = titleText;
  titleSpan.style.flex = "1";
  titleSpan.onclick = () => loadNote(noteId);

  const actions = document.createElement("div");
  actions.className = "actions";

  const addBtn = document.createElement("button");
  addBtn.innerHTML = "➕";
  addBtn.title = "Add Subnote";
  addBtn.onclick = (e) => {
    e.stopPropagation();
    const subText = prompt("Enter subnote title:");
    if (subText) {
      const subNode = createNoteNode(subText);
      children.appendChild(subNode);
    }
  };

  const toggleBtn = document.createElement("button");
  toggleBtn.innerHTML = "▶️";
  toggleBtn.title = "Toggle Children";
  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    children.classList.toggle("hidden");
    toggleBtn.innerHTML = children.classList.contains("hidden") ? "▶️" : "🔽";
  };

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = "🗑️";
  deleteBtn.title = "Delete";
  deleteBtn.onclick = (e) => {
    e.stopPropagation();
    if (confirm("Delete this note and all subnotes?")) {
      if (selectedNoteId === noteId) clearEditor();
      li.remove();
      noteMap.delete(noteId);
    }
  };

  actions.append(addBtn, toggleBtn, deleteBtn);
  label.appendChild(titleSpan);
  label.appendChild(actions);

  const children = document.createElement("ul");
  children.className = "children tree";

  li.appendChild(label);
  li.appendChild(children);

  noteData.element = li;
  noteMap.set(noteId, noteData);

  return li;
}

let selectedNoteId = null;

function loadNote(noteId) {
  const note = noteMap.get(noteId);
  if (!note) return;
  selectedNoteId = noteId;
  editorTitle.textContent = note.title;
  noteBody.innerHTML = note.content;
  noteBody.removeAttribute("disabled");
}

noteBody.addEventListener("input", () => {
  if (selectedNoteId) {
    const note = noteMap.get(selectedNoteId);
    if (note) note.content = noteBody.innerHTML;
  }
});

noteBody.addEventListener("paste", function (e) {
  e.preventDefault();
  const clipboardData = e.clipboardData || window.clipboardData;
  const htmlData = clipboardData.getData("text/html");
  const plainText = clipboardData.getData("text/plain");

  if (htmlData) {
    insertAtCursor(noteBody, htmlData, 'html');
  } else {
    insertAtCursor(noteBody, plainText, 'text');
  }
});

function insertAtCursor(el, data, type) {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  range.deleteContents();
  let node;
  if (type === 'html') {
    const temp = document.createElement("div");
    temp.innerHTML = data;
    const frag = document.createDocumentFragment();
    let child;
    while ((child = temp.firstChild)) {
      frag.appendChild(child);
    }
    range.insertNode(frag);
  } else {
    node = document.createTextNode(data);
    range.insertNode(node);
  }
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function clearEditor() {
  selectedNoteId = null;
  editorTitle.textContent = "No Note Selected";
  noteBody.innerHTML = "<p>Select a note to start editing...</p>";
  noteBody.setAttribute("disabled", "true");
}

addRootNoteBtn.addEventListener("click", () => {
  const text = newNoteInput.value.trim();
  if (text) {
    const node = createNoteNode(text);
    notesList.appendChild(node);
    newNoteInput.value = "";
  }
});

// Toggle right sidebar (unchanged)
function toggleRightSidebar() {
  rightSidebar.classList.toggle("expanded");
  rightContent.classList.toggle("hidden");
}
