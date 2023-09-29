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
    const todos = this.controller.getTodos();

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
      this.controller.toggleTodoCompletion(todoId, on ? 1 : 0);
      const checkbox = item.querySelector("input");
      checkbox.checked = on;
    });
    this.render();
  }
}

const addToDoEventHandling = (view) => {
  const toDoInput = document.querySelector(".new-todo");
  const toggleAllButton = document.querySelector("#toggle-all");

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

  CreateEvent(toDoInput, "keydown", enterkey);
  CreateEvent(document.documentElement, "click", clickAdd);
  CreateEvent(toggleAllButton, "click", toggleAll);
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

  listItems.forEach((item) => {
    CreateEvent(item, "change", toggleInputHandler);
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
