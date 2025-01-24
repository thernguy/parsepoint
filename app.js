const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const {
  getMetadata,
  fetchSitemapLinks,
  proxyRequest,
  getDriveDownloadLink,
} = require("./controllers/getMetadata");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "documentation.html"));
});
app.use("/static", express.static("public"));
app.get("/metadata", getMetadata);
app.get("/sitemap", fetchSitemapLinks);
app.get("/proxy", proxyRequest);
app.get("/drive-download", getDriveDownloadLink);

app.use((req, res) => res.status(404).send("404 Not Found!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
