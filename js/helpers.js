export const findElementInVDom = (vDom, tagName, attrs = {}) => {
  let counter = -1;
  if (vDom.tagName === tagName) {
    if (attrs) {
      counter = Object.entries(attrs).length;
      for (const [key, value] of Object.entries(attrs)) {
        if (vDom.attrs[key] !== value) {
          break;
        }
        counter--;
      }
    }
    if (counter == 0) {
      return vDom;
    }
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

  if (!toDoList) return;

  const listItems = toDoList.querySelectorAll("li");

  for (const item of listItems) {
    if (item.dataset.id === String(id)) {
      return true;
    }
  }

  return false;
};

export function containsObject(arr, obj, prop) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][prop] === obj[prop]) {
      return true;
    }
  }
  return false;
}
