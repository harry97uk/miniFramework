export class TodoModel {
  constructor() {
    this.todos = [];
  }

  addTodo(todoText) {
    this.todos.push({
      id: Date.now(),
      text: todoText,
      completed: false,
      editing: false,
    });
  }

  removeTodo(id) {
    this.todos.splice(
      this.todos.findIndex((todo) => todo.id == id),
      1
    );
  }

  toggleTodoEditing(id) {
    const todo = this.todos.find((item) => item.id === id);
    todo.editing = !todo.editing;
  }

  editTodoText(id, text) {
    const todo = this.todos.find((item) => item.id === id);
    todo.text = text;
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
