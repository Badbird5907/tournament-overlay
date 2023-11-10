export const getInputValues = (prefix: string) => {
  // get elements whose id matches the regex
  const values: any = {};
  const elements = document.querySelectorAll("[id]");
  elements.forEach((element) => {
    if (element.id.startsWith(`${prefix}-`)) {
      // if there is a value field, even if it is empty, add it to the values object
      if (Object.prototype.hasOwnProperty.call(element, "value")) {
        const newKey = element.id.replace(`${prefix}-`, "");
        // check if the element type is a input
        if (element.tagName === "INPUT") {
          const input = element as HTMLInputElement;
          if (input.type === "number") { // TODO: add more types
            values[newKey] = Number(input.value);
          } else values[newKey] = input.value;
        }
      }
    }
  });
  return values;
};
