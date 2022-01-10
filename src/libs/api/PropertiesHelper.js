import { parse } from "properties-parser";

export const convertPropertiesToJS = (properties) => {
  let output;
  try {
    output = parse(properties);
  } catch (error) {
    console.log(error.message);
  }
  return output;
};
