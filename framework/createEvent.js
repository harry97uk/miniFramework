const CreateEvent = (elem, type, f) => {
  switch (type) {
    case "click":
      elem.onclick = f;
      break;
    case "keydown":
      elem.onkeydown = f;
      break;
    default:
      break;
  }
};

export default CreateEvent;
