import { TodoModel } from "./model.js";
import { TodoView } from "./view.js";
import { findElementInVDom } from "./helpers.js";

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
    const vDomList = findElementInVDom(this.view.newVDom, "ul", {
      class: "todo-list",
    });
    if (vDomList.children) {
      vDomList.children.splice(
        vDomList.children.findIndex((child) => child.attrs["data-id"] == id),
        1
      );
    }
    this.model.removeTodo(id);
  }

  toggleTodoEditing(id) {
    this.model.toggleTodoEditing(id);
  }

  editTodoText(id, text) {
    this.model.editTodoText(id, text);
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

  clearCompletedTodos() {
    const list = document.querySelector(".todo-list");
    const listItems = list.querySelectorAll("li");
    const completedItems = list.querySelectorAll(".completed");

    completedItems.forEach((item) => {
      const itemId = parseInt(item.getAttribute("data-id"));
      this.removeTodo(itemId);
    });

    listItems.forEach((item) => {
      const checkbox = item.querySelector("input");
      checkbox.checked = false;
    });
  }

  getTodos() {
    return this.model.todos;
  }
}
