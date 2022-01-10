import path from "path";
import fs from "fs";

export default (req, res) => {
  const dir = path.resolve("./data", "metadata");

  const { templateName } = req.query;
  console.log(templateName);

  const buffer = fs.readFileSync(path.resolve(dir, templateName[0]).toString());
  const contents = buffer.toString();

  res.statusCode = 200;
  res.json({ contents });
};
