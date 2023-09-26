import CreateElement from "./createElement.js";
import Mount from "./mount.js";
import Render from "./render.js";
import diff from "./diff.js";

const createVDom = (count) => {
  return CreateElement("div", {
    attrs: {
      id: "app",
    },
    children: [
      CreateElement("h1", {
        attrs: { id: "title" },
        children: ["Title"],
      }),
    ],
  });
};

let vDom = createVDom();
const $app = Render(vDom);

let $rootEl = Mount($app, document.querySelector(".todoapp"));

setInterval(() => {
  const newVDom = createVDom();
  const patch = diff(vDom, newVDom);
  patch($rootEl);
  vDom = newVDom;
}, 1000);
