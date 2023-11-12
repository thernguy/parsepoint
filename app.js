const express = require('express');
const app = express();
const port = 3000;
const getMetadata = require('./controllers/getMetadata');
app.get('/', (req, res) => res.send('Hello World!'));
app.get('/api/v1/metadata', (req, res) => {
    if (!req.query.url) {
        res.json({ error: 'Missing required parameter `url`' });
        return;
    }
    else if (!req.query.url.startsWith('http')) {
        res.json({ error: 'Invalid URL' });
        return;
    }
    getMetadata(req, res);
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));