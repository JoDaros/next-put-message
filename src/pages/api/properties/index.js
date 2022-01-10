import { convertPropertiesToJS } from "../../../libs/api/PropertiesHelper";

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      const propertiesText = req.body;
      const properties = convertPropertiesToJS(propertiesText);
      res.status(200).json(JSON.stringify(properties));
    } catch (error) {
      res.status(400).body(error.message);
    }
  } else {
    res.status(405);
    res.end("Method not allowed");
  }
}
