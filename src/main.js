const input =document.querySelector('.input-js');
const btn =document.querySelector('.btn-add');
const list =document.querySelector('.todo-list');
 btn.addEventListener("click", addTodo);
export const buttonUpdate =
  '<button type="button" class="btn-update" ></button>';
export const buttonDelete =
  '<button type="button" class="btn-delete" >del</button>';

  function createTodo(){
    return {
        id: Date.now(),
        status: "todo",
        text: input.value,
    }
  };
  function createMarkup(todo){
    const curenBtn = todo.status === "todo" ? buttonUpdate : buttonDelete;
    return `   <li class="${todo.status}" id="${todo.id}">
          <p>
            ${todo.text}
          </p>
          ${curenBtn}
        </li>`
  };
  function addTodo(){
    const newTodo =  createTodo()
    const markup = createMarkup(newTodo)
    list.insertAdjacentHTML("beforeend", markup )

  };


