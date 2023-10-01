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

const ToDoMainView = () => {
  const header = createHeader();
  const mainSection = createMainSection();
  const footer = createFooter();

  const todoAppSection = CreateElement("section", {
    attrs: { class: "todoapp" },
    children: [header, mainSection, footer],
  });

  return todoAppSection;
};

export default ToDoMainView;
