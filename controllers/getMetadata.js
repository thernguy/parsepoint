const meta = require("html-metadata-parser");
const getMetadata = async (req, res) => {
  const url = req.query.url;

  if (!url) {
    res.status(400).json({ error: "Missing required parameter `url`" });
    return;
  }

  if (!url.startsWith("http")) {
    res
      .status(400)
      .json({ error: "Invalid URL. URL must start with http or https." });
    return;
  }

  try {
    const metadata = await meta.parser(url);
    res.json(metadata);
  } catch (error) {
    console.error("Error parsing metadata:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch metadata. Please try again later." });
  }
};
const renderPreview = async (req, res) => {
  const url = req.query.url;

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

module.exports = {
  getMetadata,
  renderPreview,
};
