import useSWR from "swr";
import axios from "axios";

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
          if (input.type === "number") {
            // TODO: add more types
            values[newKey] = Number(input.value);
          } else values[newKey] = input.value;
        }
      }
    }
  });
  return values;
};

export const useCurrentMatch = () => {
  const swr = useSWR("/api/admin/settings/currentMatch/get");
  return {
    url: "/api/admin/settings/currentMatch/get",
    value: swr.data?.data,
    ...swr,
  };
};

export const setSettingClient = async (key: string, value: any) => {
  const res = await axios.post(`/api/admin/settings/${key}/set`, {
    value,
  });
  return res.data;
};
