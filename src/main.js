import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";
import * as basicLightbox from "basiclightbox";
import "basiclightbox/dist/basicLightbox.min.css";

const KEY = "todo";
const lsData = loadFromLS(KEY);
let instance = null;

const input = document.querySelector(".input-js");
const btn = document.querySelector(".btn-add");
const list = document.querySelector(".todo-list");
btn.addEventListener("click", addTodo);
list.addEventListener("click", toggleStatus);
list.addEventListener("click", openModal);
list.addEventListener("click", deleteTodo);

export const buttonUpdate =
  '<button type="button" class="btn-update" ></button>';
export const buttonDelete =
  '<button type="button" class="btn-delete" >del</button>';

function createTodo() {
  return {
    id: Date.now(),
    status: "todo",
    text: input.value,
  };
}
function createMarkup(todo) {
  const curenBtn = todo.status === "todo" ? buttonUpdate : buttonDelete;
  return `   <li class="${todo.status}" id="${todo.id}">
          <p>
            ${todo.text}
          </p>
          ${curenBtn}
        </li>`;
}
function addTodo() {
  if (!input.value.trim()) {
    return iziToast.error({
      message: "Ви нічого не ввели",
      position: "topRight",
    });
  }
  const newTodo = createTodo();
  const markup = createMarkup(newTodo);
  list.insertAdjacentHTML("beforeend", markup);
  saveToLS(newTodo);
  input.value = "";
}

function saveToLS(todo) {
  const arr = JSON.parse(localStorage.getItem(KEY)) || [];
  arr.push(todo);
  localStorage.setItem(KEY, JSON.stringify(arr));
}

function loadFromLS(key) {
  const body = localStorage.getItem(key);
  try {
    const data = JSON.parse(body);
    return data;
  } catch {
    return body;
  }
}

function reloadPage() {
  const markup = lsData.map(createMarkup).join("");
  list.innerHTML = markup;
}

if (lsData !== null) {
  reloadPage();
}

function toggleStatus(e) {
  if (e.target.nodeName !== "LI") return;
  if (e.target.classList.contains("todo")) {
    e.target.classList.replace("todo", "complete");
    e.target.lastElementChild.remove();
    e.target.insertAdjacentHTML("beforeend", buttonDelete);
  } else {
    e.target.classList.replace("complete", "todo");
    e.target.lastElementChild.remove();
    e.target.insertAdjacentHTML("beforeend", buttonUpdate);
  }
  updateStatusLS(e.target);
}

function updateStatusLS(el) {
  const data = loadFromLS(KEY);
  const newStatus = data.map((todo) => {
    if (todo.id === +el.id) {
      todo.status = el.classList[0];
    }
    return todo;
  });
  localStorage.setItem(KEY, JSON.stringify(newStatus));
}

function openModal(event) {
  if (!event.target.classList.contains("btn-update")) {
    return;
  }
  instance = basicLightbox.create(
    `<div class="modal-container"><button type="button" class="btn-close-modal">X</button><input type="text" class="input-modal"/><button type="button" class="btn-update-modal" id="${event.target.parentNode.id}">Update todo</button></div>`,
    {
      closable: false,
    }
  );
  instance.show();
  const btnClose = document.querySelector(".btn-close-modal");
  const modalInput = document.querySelector(".input-modal");
  const btnUpdateModal = document.querySelector(".btn-update-modal");
  btnClose.addEventListener("click", instance.close);
  btnUpdateModal.addEventListener("click", (event) =>
    updateModal(event, modalInput.value)
  );
}

function updateModal(event, value) {
  [...list.children].forEach((todo) => {
    if (event.target.id === todo.id) {
      todo.firstElementChild.textContent = value;
    }
  });
  updateLS(event.target, value);
  instance.close();
}

function updateLS(elem, value) {
  const data = loadFromLS(KEY);
  const newStatus = data.map((todo) => {
    if (todo.id === +elem.id) {
      todo.text = value;
    }
    return todo;
  });
  localStorage.setItem(KEY, JSON.stringify(newStatus));
}

function deleteTodoFromLS(el) {
    const data = loadFromLS(KEY);
  const newStatus = data.filter((todo) => todo.id !== +el.id);
  localStorage.setItem(KEY, JSON.stringify(newStatus));
}

function deleteTodo (event) {
    if (!event.target.classList.contains("btn-delete")) {
        return;
      }
      event.target.parentNode.remove();
      deleteTodoFromLS(event.target.parentNode)
}