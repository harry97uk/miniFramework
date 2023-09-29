export class TodoModel {
  constructor() {
    this.todos = [];
  }

  addTodo(todoText) {
    this.todos.push({ id: Date.now(), text: todoText, completed: false });
  }

  toggleTodoCompletion(todoId) {
    const todo = this.todos.find((item) => item.id === todoId);
    if (todo) {
      todo.completed = !todo.completed;
    }
  }

  // Add methods for updating, deleting, and retrieving todos as needed
}
