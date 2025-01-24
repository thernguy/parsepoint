const express = require("express");
const app = express();
const port = 3000;
const {
  getMetadata,
  fetchSitemapLinks,
  proxyRequest,
} = require("./controllers/getMetadata");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/metadata", getMetadata);
app.get("/sitemap", fetchSitemapLinks);
app.get("/proxy", proxyRequest);

app.use((req, res) => res.status(404).send("404 Not Found!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
