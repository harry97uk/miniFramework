const CreateEvent = (elem, type, f) => {
  switch (type) {
    case "click":
      elem.onclick = f;
      break;
    case "keydown":
      elem.onkeydown = f;
      break;
    case "keyup":
      elem.onkeyup = f;
      break;
    case "change":
      elem.onchange = f;
      break;
    case "dblclick":
      elem.ondblclick = f;
      break;
    default:
      break;
  }
};

export default CreateEvent;
