import { TodoModel } from "./model.js";
import { TodoView } from "./view.js";

export class TodoController {
  constructor(root) {
    this.model = new TodoModel();
    this.view = new TodoView(this, root);
    this.root = root;
  }

  addTodo(todoText) {
    this.model.addTodo(todoText);
  }

  removeTodo(id) {
    this.model.removeTodo(id);
  }

  toggleTodoCompletion(todoId, all = -1) {
    this.model.toggleTodoCompletion(todoId, all);
  }

  toggleAllTodosCompletion() {
    const list = document.querySelector(".todo-list");
    const listItems = list.querySelectorAll("li");

    let on = false;

    for (const item of listItems) {
      if (item.className === "") {
        on = true;
        break;
      }
    }

    listItems.forEach((item) => {
      const todoId = parseInt(item.getAttribute("data-id"));
      this.toggleTodoCompletion(todoId, on ? 1 : 0);
      const checkbox = item.querySelector("input");
      checkbox.checked = on;
    });
  }

  getTodos() {
    return this.model.todos;
  }
}
