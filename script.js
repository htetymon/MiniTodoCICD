const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const emptyMessage = document.getElementById("empty-message");

let todos = [];

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function render() {
  list.innerHTML = "";
  emptyMessage.style.display = todos.length ? "none" : "block";

  todos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.done ? " done" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleDone(index));

    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = todo.text;

    const editBtn = document.createElement("button");
    editBtn.className = "item-btn";
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => editTodo(index, li, span));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "item-btn delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(index));

    li.append(checkbox, span, editBtn, deleteBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.push({ text, done: false });
  input.value = "";
  save();
  render();
});

function toggleDone(index) {
  todos[index].done = !todos[index].done;
  save();
  render();
}

function editTodo(index, li, span) {
  const editInput = document.createElement("input");
  editInput.className = "edit-input";
  editInput.value = todos[index].text;

  const saveBtn = document.createElement("button");
  saveBtn.className = "item-btn";
  saveBtn.textContent = "Save";

  const cancelBtn = document.createElement("button");
  cancelBtn.className = "item-btn delete";
  cancelBtn.textContent = "Cancel";

  li.replaceChild(editInput, span);

  const buttons = li.querySelectorAll(".item-btn");
  buttons.forEach((b) => (b.style.display = "none"));

  li.append(saveBtn, cancelBtn);

  saveBtn.addEventListener("click", () => {
    const newText = editInput.value.trim();
    if (newText) {
      todos[index].text = newText;
      save();
    }
    render();
  });

  cancelBtn.addEventListener("click", render);

  editInput.focus();
}

function deleteTodo(index) {
  todos.splice(index, 1);
  save();
  render();
}

todos = JSON.parse(localStorage.getItem("todos")) || [];
render();