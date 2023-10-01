import CreateElement from "../framework/createElement.js";
import NestElements from "../framework/nestElements.js";
import ToDoMainView from "../views/mainView.js";
import diff from "../framework/diff.js";
import CreateEvent from "../framework/createEvent.js";
import RemoveChildElement from "../framework/removeElement.js";
import AddAttributesToElem from "../framework/addAttributes.js";
import { listContains, findElementInVDom } from "./helpers.js";

export class TodoView {
  constructor(controller, root) {
    this.root = root;
    this.controller = controller;
    this.vDom = CreateElement("section", { attrs: { class: "todoapp" } });
    this.newVDom = ToDoMainView();
    this.render();
    addNewTodoEventHandling(this);
  }

  render() {
    const patch = diff(this.vDom, this.newVDom);
    patch(this.root);
    const todos = this.controller.getTodos();
    if (todos.length > 0) {
      addListItemEvents(this);
    }
    this.vDom = JSON.parse(JSON.stringify(this.newVDom));
  }

  updateVDom() {
    const todos = this.controller.getTodos();
    updateVisibleSections(todos, this);
    getVDomSections(this);

    todos.forEach((todo) => {
      if (!listContains(todo.id)) {
        const listItem = createListItem(todo);
        NestElements(this.todoList, listItem, todos.length);
      } else {
        updateListItem(this.newVDom, todo);
      }
    });
  }

  handleAddTodo(text) {
    const trimmedText = text.trim();
    if (trimmedText) {
      this.controller.addTodo(trimmedText);
      this.updateVDom();
      this.render();
    }
  }

  handleRemoveTodo(event) {
    if (event.target.tagName === "BUTTON") {
      const todoId = parseInt(
        event.target.parentElement.parentElement.getAttribute("data-id")
      );
      this.controller.removeTodo(todoId);
      this.updateVDom();
      this.render();
    }
  }

  handleEditing(event) {
    if (event.target.tagName === "LABEL") {
      const todoId = parseInt(
        event.target.parentElement.parentElement.getAttribute("data-id")
      );
      this.controller.toggleTodoEditing(todoId);
      this.updateVDom();
      this.render();
    }
  }

  handleFinishEditing(event) {
    const todoId = parseInt(
      document.querySelector(".editing").getAttribute("data-id")
    );
    this.controller.toggleTodoEditing(todoId);
    const newText = document.querySelector(".edit").value;
    this.controller.editTodoText(todoId, newText);
    this.updateVDom();
    this.render();
  }

  handleToggleTodo(event) {
    if (event.target.tagName === "INPUT") {
      const todoId = parseInt(
        event.target.parentElement.parentElement.getAttribute("data-id")
      );
      this.controller.toggleTodoCompletion(todoId);
      this.updateVDom();
      this.render();
    }
  }

  handleToggleAllTodo() {
    this.controller.toggleAllTodosCompletion();
    this.updateVDom();
    this.render();
  }

  handleClearCompleted() {
    this.controller.clearCompletedTodos();
    this.updateVDom();
    this.render();
  }
}

const getVDomSections = (view) => {
  view.todoList = findElementInVDom(view.newVDom, "ul", {
    class: "todo-list",
  });
  view.inputField = findElementInVDom(view.newVDom, "input", {
    class: "new-todo",
  });
  view.clearCompletedButton = findElementInVDom(view.newVDom, "button", {
    class: "clear-completed",
  });
  view.mainSection = findElementInVDom(view.newVDom, "section", {
    class: "main",
  });
  view.footerSection = findElementInVDom(view.newVDom, "footer", {
    class: "footer",
  });
};

const addNewTodoEventHandling = (view) => {
  const toDoInput = document.querySelector(".new-todo");

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

  CreateEvent(toDoInput, "keydown", enterkey);
  CreateEvent(document.documentElement, "click", clickAdd);
};

const addOtherTodoEventHandling = (view) => {
  const toggleAllButton = document.querySelector("#toggle-all");
  const clearCompletedButton = document.querySelector(".clear-completed");

  const toggleAll = (e) => {
    view.handleToggleAllTodo();
  };

  const clearCompleted = (e) => {
    view.handleClearCompleted();
  };

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

  const editing = (e) => {
    view.handleEditing(e);
  };

  listItems.forEach((item) => {
    if (item.classList.contains("editing")) {
      addListItemEditingEvents(view);
    }
    const toggleInput = item.querySelector("input");
    const destroyButton = item.querySelector("button");
    CreateEvent(toggleInput, "change", toggleInputHandler);
    CreateEvent(destroyButton, "click", destoryHandler);
    CreateEvent(item, "dblclick", editing);
  });
};

const addListItemEditingEvents = (view) => {
  const finishEditingEnter = (e) => {
    if (e.key === "Enter") {
      view.handleFinishEditing();
    }
  };

  const finishEditingClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    const toDoInput = document.querySelector(".edit");
    const inputRect = toDoInput.getBoundingClientRect();

    if (
      x < inputRect.left ||
      x > inputRect.right ||
      y < inputRect.top ||
      y > inputRect.bottom
    ) {
      view.handleFinishEditing();
    }
  };

  CreateEvent(document.documentElement, "click", finishEditingClick);
  CreateEvent(document.documentElement, "keydown", finishEditingEnter);
};

const updateListItem = (vDom, todo) => {
  const listItem = findElementInVDom(vDom, "li", { "data-id": todo.id });

  const listItemLabel = findElementInVDom(listItem, "label");
  listItemLabel.children = [todo.text];

  let classString = "";
  if (todo.completed) {
    classString += "completed";
  }
  if (todo.editing) {
    classString += " editing";
    const editInput = CreateElement("input", {
      attrs: { class: "edit", value: todo.text },
    });
    NestElements(listItem, editInput);
  } else {
    RemoveChildElement(listItem, {
      tagName: "input",
      attrs: { class: "edit" },
    });
  }
  listItem.attrs.class = classString;
};

const updateVisibleSections = (todos, view) => {
  if (todos.length > 0) {
    if (view.mainSection && view.footerSection) {
      view.mainSection.attrs.style = "display: block";
      view.footerSection.attrs.style = "display: block";
    } else {
      view.mainSection = createMainSection();
      view.footerSection = createFooter();
      NestElements(
        view.newVDom,
        view.mainSection,
        view.newVDom.children.length
      );
      NestElements(
        view.newVDom,
        view.footerSection,
        view.newVDom.children.length
      );
      view.render();
      addOtherTodoEventHandling(view);
    }
  } else {
    if (view.mainSection && view.footerSection) {
      view.mainSection.attrs.style = "display: none";
      view.footerSection.attrs.style = "display: none";
    }
  }
  if (todos.some((todo) => todo.completed)) {
    view.clearCompletedButton.attrs.style = "display: block";
  } else {
    if (view.clearCompletedButton) {
      view.clearCompletedButton.attrs.style = "display: none";
    }
  }
};

const createMainSection = () => {
  const toggleAll = CreateElement("input", { children: [] });
  const toggleAllAttrs = {
    id: "toggle-all",
    class: "toggle-all",
    type: "checkbox",
  };
  AddAttributesToElem(toggleAll, toggleAllAttrs);

  const toggleLabel = CreateElement("label", {
    attrs: { for: "toggle-all" },
    children: ["Mark all as complete"],
  });

  const todoUnorderedList = CreateElement("ul", {
    attrs: { class: "todo-list" },
  });

  const mainSection = CreateElement("section", {
    attrs: { class: "main" },
    children: [toggleAll, toggleLabel, todoUnorderedList],
  });

  return mainSection;
};

const createFooter = () => {
  const todoCount = CreateElement("span", { attrs: { class: "todo-count" } });

  const listItems = Array.from({ length: 3 }, () => CreateElement("li"));

  const allFilter = CreateElement("a", {
    attrs: { href: "#/", class: "selected" },
    children: ["All"],
  });
  const activeFilter = CreateElement("a", {
    attrs: { href: "#/active" },
    children: ["Active"],
  });
  const completedFilter = CreateElement("a", {
    attrs: { href: "#/completed" },
    children: ["Completed"],
  });

  NestElements(listItems[0], allFilter);
  NestElements(listItems[1], activeFilter);
  NestElements(listItems[2], completedFilter);

  const filtersList = CreateElement("ul", {
    attrs: { class: "filters" },
    children: [...listItems],
  });

  const clearCompletedButton = CreateElement("button", {
    attrs: { class: "clear-completed", style: "display: none" },
    children: ["Clear Completed"],
  });

  const footer = CreateElement("footer", {
    attrs: { class: "footer" },
    children: [todoCount, filtersList, clearCompletedButton],
  });

  return footer;
};
