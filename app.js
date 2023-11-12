const express = require('express');
const app = express();
const port = 3000;
const getMetadata = require('./controllers/getMetadata');
express().get('/', (req, res) => res.send('Hello World!'));
app.get('/api/v1/metadata', getMetadata) ;
app.get('*', (req, res) => res.send('404 Not Found!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));