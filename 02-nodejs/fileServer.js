const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const portNumber = 3000;

const filesPath = path.join(process.cwd(), "/files");
app.get("/files", async (req, res) => {
  try {
    const allFiles = await fs.readdir(filesPath);
    if (allFiles) {
      return res.status(200).json(allFiles);
    }
    res.status(500).json({ error: "Failed to retrieve files" });
  } catch (e) {
    console.error("Error found in get route /files", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/file/:filename", async (req, res) => {
  try {
    const { filename } = req.params;
    const allFiles = await fs.readdir(filesPath);
    if (!allFiles.includes(filename)) {
      res.status(404).send("File not found");
      return;
    }
    const fileContent = await fs.readFile(
      filesPath.concat(`/${filename}`),
      "utf-8"
    );
    res.status(200).send(fileContent);
  } catch (e) {
    console.error("Error found in get route /files", e);
    res.status(500).json({ error: "Failed to retrieve files" });
  }
});

app.use((req, res) => {
  res.status(404).send("Route not found");
});

app.listen(portNumber, () => {
  console.log(`File server listening on port number ${portNumber}`);
});

module.exports = app;
