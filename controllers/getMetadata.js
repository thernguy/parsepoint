const { default: axios } = require("axios");
const meta = require("html-metadata-parser");
const { default: parse } = require("node-html-parser");

const getMetadata = async (req, res) => {
  const url = req.query.url;
  const preview = req.query.preview === "true";
  if (!url) {
    res.status(400).send("<h1>Error: Missing required parameter `url`</h1>");
    return;
  }

  if (!url.startsWith("http")) {
    res
      .status(400)
      .send("<h1>Error: Invalid URL. URL must start with http or https.</h1>");
    return;
  }

  try {
    const metadata = await meta.parser(url);

    if (!preview) {
      res.json(metadata);
      return;
    }
    // Extract relevant data
    const title = metadata.meta.title || "No Title Available";
    const description = metadata.meta.description || "No Description Available";
    const image =
      metadata.og.image || "https://via.placeholder.com/600x300?text=No+Image";
    // Render HTML with metadata
    res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>URL Preview</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2em; text-align: center; }
                    img { max-width: 100%; height: auto; }
                    .container { border: 1px solid #ddd; padding: 1em; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${title}</h1>
                    <img src="${image}" alt="Preview Image">
                    <p>${description}</p>
                    <p><a href="${url}" target="_blank">Visit URL</a></p>
                </div>
            </body>
            </html>
        `);
  } catch (error) {
    console.error("Error parsing metadata:", error);
    res
      .status(500)
      .send("<h1>Failed to fetch metadata. Please try again later.</h1>");
  }
};

const fetchSitemapLinks = async (req, res) => {
  const url = req.query.url;
  const preview = req.query.preview === "true";

  if (!url) {
    return res.json({ error: "Missing required parameter `url`" });
  }
  if (!url.startsWith("http")) {
    return res.json({ error: "Invalid URL" });
  }
  try {
    const response = await axios.get(url);
    const html = parse(response.data);
    const links = html
      .querySelectorAll("a")
      .map((a) => a.getAttribute("href"))
      .filter(Boolean);

    if (preview) {
      // Generate HTML preview
      const linkList = links
        .map((link) => `<li><a href="${link}" target="_blank">${link}</a></li>`)
        .join("");
      res.send(`
              <html>
                  <body>
                      <h1>Preview of Links</h1>
                      <ul>${linkList}</ul>
                  </body>
              </html>
          `);
    } else {
      // Return JSON response
      res.json({ links });
    }
  } catch (error) {
    res.json({ error: "Failed to fetch sitemap links" });
  }
};

const proxyRequest = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: "Missing required parameter `url`" });
  }

  if (!url.startsWith("http")) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  try {
    // Make the request to the target URL
    const response = await axios.get(url, {
      headers: {
        // Add custom headers if required, e.g., User-Agent
        "User-Agent": "Node.js Proxy Server",
      },
    });

    // Pass the fetched content back to the client
    res.status(200).send(response.data);
  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(500).json({ error: "Failed to fetch the requested URL" });
  }
};
const getDriveDownloadLink = (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing required parameter `url`" });
  }

  const driveRegex =
    /https?:\/\/drive\.google\.com\/(?:file\/d\/|open\?id=)([^\/\?]+)/;
  const match = url.match(driveRegex);

  if (!match) {
    return res.status(400).json({ error: "Invalid Google Drive URL" });
  }

  const fileId = match[1]; 
  const downloadLink = `https://drive.google.com/uc?id=${fileId}&export=download`;

  res.json({ downloadLink });
};

module.exports = {
  getMetadata,
  fetchSitemapLinks,
  proxyRequest,
  getDriveDownloadLink,
};
