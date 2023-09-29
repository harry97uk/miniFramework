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

  toggleTodoCompletion(todoId, all = -1) {
    this.model.toggleTodoCompletion(todoId, all);
  }

  getTodos() {
    return this.model.todos;
  }
}
