export const findElementInVDom = (vDom, tagName, attrs) => {
  if (vDom.tagName === tagName) {
    if (attrs) {
      for (const [key, value] of Object.entries(attrs)) {
        if (vDom.attrs[key] !== value) {
          return null;
        }
      }
    }
    return vDom;
  }

  if (vDom.children) {
    for (const child of vDom.children) {
      const result = findElementInVDom(child, tagName, attrs);
      if (result) {
        return result;
      }
    }
  }

  return null;
};

export const listContains = (id) => {
  const toDoList = document.querySelector(".todo-list");

  const listItems = toDoList.querySelectorAll("li");

  for (const item of listItems) {
    if (item.dataset.id === String(id)) {
      return true;
    }
  }

  return false;
};
