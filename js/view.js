import CreateElement from "../framework/createElement.js";
import NestElements from "../framework/nestElements.js";
import ToDoMainView from "../views/mainView.js";
import diff from "../framework/diff.js";
import AddAttributesToElem from "../framework/addAttributes.js";
import CreateEvent from "../framework/createEvent.js";
import { listContains, findElementInVDom } from "./helpers.js";

export class TodoView {
  constructor(controller, root) {
    this.root = root;
    this.controller = controller;
    this.vDom = CreateElement("section", { attrs: { class: "todoapp" } });
    this.newVDom = ToDoMainView();
    this.render();
    addToDoEventHandling(this);
  }

  render() {
    this.todoList = findElementInVDom(this.newVDom, "ul", {
      class: "todo-list",
    });
    this.inputField = findElementInVDom(this.newVDom, "input", {
      class: "new-todo",
    });
    this.clearCompletedButton = findElementInVDom(this.newVDom, "button", {
      class: "clear-completed",
    });
    const todos = this.controller.getTodos();

    if (todos.some((todo) => todo.completed)) {
      this.clearCompletedButton.attrs.style = "display: block";
    } else {
      this.clearCompletedButton.attrs.style = "display: none";
    }

    todos.forEach((todo) => {
      if (!listContains(todo.id)) {
        const listItem = createListItem(todo);
        NestElements(this.todoList, listItem, todos.length);
      } else {
        updateListItem(this.newVDom, todo);
      }
    });

    const patch = diff(this.vDom, this.newVDom);
    patch(this.root);
    addListItemEvents(this);
    this.vDom = JSON.parse(JSON.stringify(this.newVDom));
  }

  handleAddTodo(text) {
    if (text) {
      this.controller.addTodo(text);
      this.render();
    }
  }

  handleRemoveTodo(event) {
    if (event.target.tagName === "BUTTON") {
      const todoId = parseInt(
        event.target.parentElement.parentElement.getAttribute("data-id")
      );
      this.controller.removeTodo(todoId);
      this.render();
    }
  }

  handleToggleTodo(event) {
    if (event.target.tagName === "INPUT") {
      const todoId = parseInt(
        event.target.parentElement.parentElement.getAttribute("data-id")
      );
      this.controller.toggleTodoCompletion(todoId);
      this.render();
    }
  }

  handleToggleAllTodo() {
    this.controller.toggleAllTodosCompletion();
    this.render();
  }

  handleClearCompleted() {
    this.controller.clearCompletedTodos();
    this.render();
  }
}

const addToDoEventHandling = (view) => {
  const toDoInput = document.querySelector(".new-todo");
  const toggleAllButton = document.querySelector("#toggle-all");
  const clearCompletedButton = document.querySelector(".clear-completed");

  const enterkey = (e) => {
    if (e.key === "Enter") {
      view.handleAddTodo(toDoInput.value);
      toDoInput.value = "";
    }
  };

  const clickAdd = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const inputRect = toDoInput.getBoundingClientRect();

    if (
      x < inputRect.left ||
      x > inputRect.right ||
      y < inputRect.top ||
      y > inputRect.bottom
    ) {
      view.handleAddTodo(toDoInput.value);
      toDoInput.value = "";
    }
  };

  const toggleAll = (e) => {
    view.handleToggleAllTodo();
  };

  const clearCompleted = (e) => {
    view.handleClearCompleted();
  };

  CreateEvent(toDoInput, "keydown", enterkey);
  CreateEvent(document.documentElement, "click", clickAdd);
  CreateEvent(toggleAllButton, "click", toggleAll);
  CreateEvent(clearCompletedButton, "click", clearCompleted);
};

const createListItem = (todo) => {
  const toggleInput = CreateElement("input", {
    attrs: { class: "toggle", type: "checkbox" },
  });
  const itemLabel = CreateElement("label", { children: [todo.text] });
  const destroyButton = CreateElement("button", {
    attrs: { class: "destroy" },
  });

  const viewDiv = CreateElement("div", {
    attrs: { class: "view" },
    children: [toggleInput, itemLabel, destroyButton],
  });

  const listItem = CreateElement("li", {
    attrs: {
      class: todo.completed ? "completed" : "",
      "data-id": todo.id,
    },
    children: [viewDiv],
  });

  return listItem;
};

const addListItemEvents = (view) => {
  const list = document.querySelector(".todo-list");
  const listItems = list.querySelectorAll("li");

  const toggleInputHandler = (e) => {
    view.handleToggleTodo(e);
  };

  const destoryHandler = (e) => {
    view.handleRemoveTodo(e);
  };

  listItems.forEach((item) => {
    const toggleInput = item.querySelector("input");
    const destroyButton = item.querySelector("button");
    CreateEvent(toggleInput, "change", toggleInputHandler);
    CreateEvent(destroyButton, "click", destoryHandler);
  });
};

const updateListItem = (vDom, todo) => {
  const listItem = findElementInVDom(vDom, "li", { "data-id": todo.id });

  if (listItem && listItem.attrs.class === "completed" && !todo.completed) {
    listItem.attrs.class = "";
  } else if (
    listItem &&
    listItem.attrs.class !== "completed" &&
    todo.completed
  ) {
    listItem.attrs.class = "completed";
  }
};
