import CreateElement from "../framework/createElement.js";
import NestElements from "../framework/nestElements.js";
import ToDoMainView from "../views/mainView.js";
import diff from "../framework/diff.js";
import AddAttributesToElem from "../framework/addAttributes.js";
import CreateEvent from "../framework/createEvent.js";

export class TodoView {
  constructor(controller, root) {
    this.root = root;
    this.controller = controller;
    this.vDom = CreateElement("section", { attrs: { class: "todoapp" } });
    this.newVDom = ToDoMainView();
    //this.inputField = getToDoInputElement(this.newVDom);
    //    this.todoList.addEventListener("click", this.handleToggleTodo.bind(this));
    this.render();
    addToDoEventHandling(this);
  }

  render() {
    this.todoList = getToDoListElement(this.newVDom);
    this.inputField = getToDoInputElement(this.newVDom);
    const todos = this.controller.getTodos();

    todos.forEach((todo) => {
      if (!listContains(todo.id)) {
        const listItem = createListItem(todo);
        NestElements(this.todoList, listItem);
      }
    });

    const patch = diff(this.vDom, this.newVDom);
    patch(this.root);
    this.vDom = JSON.parse(JSON.stringify(this.newVDom));
  }

  handleAddTodo(text) {
    if (text) {
      this.controller.addTodo(text);
      this.render();
    }
  }

  handleToggleTodo(event) {
    if (event.target.tagName === "LI") {
      const todoId = parseInt(event.target.getAttribute("data-id"));
      this.controller.toggleTodoCompletion(todoId);
      this.render();
    }
  }
}

export const handleEvent = (event) => {
  console.log(event);
};

const getToDoListElement = (vDom) => {
  const mainSection = vDom.children.find((child) => {
    return child.tagName === "section" && child.attrs.class === "main";
  });

  const ulTodoList = mainSection.children.find((child) => {
    return child.tagName === "ul" && child.attrs.class === "todo-list";
  });

  return ulTodoList;
};

const getToDoInputElement = (vDom) => {
  const header = vDom.children.find((child) => {
    return child.tagName === "header" && child.attrs.class === "header";
  });

  const inputTodo = header.children.find((child) => {
    return child.tagName === "input" && child.attrs.class === "new-todo";
  });

  return inputTodo;
};

const addToDoEventHandling = (view) => {
  const toDoInput = document.querySelector(".new-todo");
  const enterkey = (e) => {
    if (e.key === "Enter") {
      view.handleAddTodo(toDoInput.value);
      toDoInput.value = "";
    }
  };
  CreateEvent(toDoInput, "keydown", enterkey);
  CreateEvent(toDoInput, "click", enterkey);
};

const listContains = (id) => {
  const toDoList = document.querySelector(".todo-list");

  const listItems = toDoList.querySelectorAll("li");

  let found = false;

  listItems.forEach((item) => {
    if (item.dataset.id === String(id)) {
      found = true;
    }
  });

  return found;
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
