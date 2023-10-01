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

const ToDoMainView = () => {
  const header = createHeader();

  const todoAppSection = CreateElement("section", {
    attrs: { class: "todoapp" },
    children: [header],
  });

  return todoAppSection;
};

export default ToDoMainView;
