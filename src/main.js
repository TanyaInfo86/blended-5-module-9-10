import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const KEY = "todo";
const lsData = loadFromLS(KEY);

const input = document.querySelector(".input-js");
const btn = document.querySelector(".btn-add");
const list = document.querySelector(".todo-list");
btn.addEventListener("click", addTodo);

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
