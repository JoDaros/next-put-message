import fs from "fs";
import path from "path";

export default (req, res) => {
  const dir = path.resolve("./data", "metadata");

  const filenames = fs.readdirSync(dir);

  const templates = filenames.map((name) => path.join(name));

  res.statusCode = 200;
  res.json(templates);
};
