export class TodoModel {
  constructor() {
    this.todos = [];
  }

  addTodo(todoText) {
    this.todos.push({ id: Date.now(), text: todoText, completed: false });
  }

  toggleTodoCompletion(todoId, all = -1) {
    const todo = this.todos.find((item) => item.id === todoId);
    if (todo && all == -1) {
      todo.completed = !todo.completed;
    } else if (todo && all == 0) {
      todo.completed = false;
    } else if (todo && all == 1) {
      todo.completed = true;
    }
  }

  // Add methods for updating, deleting, and retrieving todos as needed
}
