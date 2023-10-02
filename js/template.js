import AddAttributesToElem from "../framework/addAttributes.js";
import CreateElement from "../framework/createElement.js";
import NestElements from "../framework/nestElements.js";

const createHeader = () => {
  const todoH1 = CreateElement("h1", { attrs: {}, children: ["todos"] });
  const todoInput = CreateElement("input", { attrs: {}, children: [] });

  const todoInputAttrs = {
    class: "new-todo",
    placeholder: "What needs to be done?",
    autofocus: "",
  };
  AddAttributesToElem(todoInput, todoInputAttrs);

  const header = CreateElement("header", {
    attrs: { class: "header" },
    children: [todoH1, todoInput],
  });

  return header;
};

export const createMainSection = () => {
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

export const createFooter = () => {
  const todoCount = CreateElement("strong", { children: ["1"] });

  const todoCountSpan = CreateElement("span", {
    attrs: { class: "todo-count" },
    children: [todoCount, " item left"],
  });

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
    children: [todoCountSpan, filtersList, clearCompletedButton],
  });

  return footer;
};

export const ToDoMainView = () => {
  const header = createHeader();

  const todoAppSection = CreateElement("section", {
    attrs: { class: "todoapp" },
    children: [header],
  });

  return todoAppSection;
};

export const createListItem = (todo) => {
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
