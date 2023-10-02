import CreateElement from "../framework/createElement.js";
import CreateEvent from "../framework/createEvent.js";
import Mount from "../framework/mount.js";
import Render from "../framework/render.js";
import { TodoController } from "./controller.js";

const $app = Render(CreateElement("section", { attrs: { class: "todoapp" } }));

let $rootEl = Mount($app, document.querySelector(".todoapp"));

const todoApp = new TodoController($rootEl);
