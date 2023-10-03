import CreateElement from "../framework/createElement.js";
import NestElements from "../framework/nestElements.js";
import diff from "../framework/diff.js";
import CreateEvent from "../framework/createEvent.js";
import RemoveChildElement from "../framework/removeElement.js";
import { listContains, findElementInVDom, containsObject } from "./helpers.js";
import {
  createFooter,
  createMainSection,
  ToDoMainView,
  createListItem,
} from "./template.js";

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
      assertCheckedStatus(todos);
    }
    this.vDom = JSON.parse(JSON.stringify(this.newVDom));
  }

  updateVDom() {
    const todos = this.controller.getTodos();
    updateVisibleSections(todos, this);
    getVDomSections(this);

    const filteredTodos = todos.filter((todo) => {
      if (window.location.hash === "#/active") {
        return !todo.completed;
      } else if (window.location.hash === "#/completed") {
        return todo.completed;
      }
      return true;
    });

    todos.forEach((todo) => {
      if (containsObject(filteredTodos, todo, "id")) {
        if (!listContains(todo.id)) {
          const listItem = createListItem(todo);
          NestElements(this.todoList, listItem, todo.order);
        } else {
          updateListItem(this.newVDom, todo);
        }
      } else {
        if (listContains(todo.id)) {
          const listItem = findElementInVDom(this.todoList, "li", {
            "data-id": todo.id,
          });
          RemoveChildElement(this.todoList, listItem);
        }
      }
    });

    const todoCount = todos.filter((todo) => !todo.completed).length;
    const todoCountElem = CreateElement("strong", {
      children: [String(todoCount)],
    });
    this.todoCount.children = [
      todoCountElem,
      todoCount == 1 ? " item left" : " items left",
    ];
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

  handleChangeFilter(event) {
    const allFilterButton = findElementInVDom(this.newVDom, "a", {
      href: "#/",
    });
    const activeFilterButton = findElementInVDom(this.newVDom, "a", {
      href: "#/active",
    });
    const completedFilterButton = findElementInVDom(this.newVDom, "a", {
      href: "#/completed",
    });

    if (event.target.tagName === "A") {
      const ref = event.target.getAttribute("href");
      switch (ref) {
        case "#/":
          allFilterButton.attrs.class = "selected";
          activeFilterButton.attrs.class = "";
          completedFilterButton.attrs.class = "";
          break;
        case "#/active":
          activeFilterButton.attrs.class = "selected";
          allFilterButton.attrs.class = "";
          completedFilterButton.attrs.class = "";
          break;
        case "#/completed":
          completedFilterButton.attrs.class = "selected";
          allFilterButton.attrs.class = "";
          activeFilterButton.attrs.class = "";
          break;

        default:
          allFilterButton.attrs.class = "selected";
          activeFilterButton.attrs.class = "";
          completedFilterButton.attrs.class = "";
          break;
      }
    }
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
  view.todoCount = findElementInVDom(view.newVDom, "span", {
    class: "todo-count",
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
  const filterButtons = document.querySelectorAll("a");

  const changeFilter = (e) => {
    view.handleChangeFilter(e);
  };

  const toggleAll = (e) => {
    view.handleToggleAllTodo();
  };

  const clearCompleted = (e) => {
    view.handleClearCompleted();
  };

  CreateEvent(toggleAllButton, "click", toggleAll);
  CreateEvent(clearCompletedButton, "click", clearCompleted);
  filterButtons.forEach((button) => {
    CreateEvent(button, "click", changeFilter);
  });
  CreateEvent(window, "popstate", () => {
    view.updateVDom();
    view.render();
  });
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

const assertCheckedStatus = (todos) => {
  const list = document.querySelector(".todo-list");
  const listItems = list.querySelectorAll("li");

  listItems.forEach((item) => {
    const itemId = parseInt(item.getAttribute("data-id"));
    const index = todos.findIndex((todo) => todo.id === itemId);
    const checkbox = item.querySelector("input.toggle");
    checkbox.checked = todos[index].completed;
  });
};
