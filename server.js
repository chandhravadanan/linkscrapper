
const express = require('express');
const path = require('path');
const cache = require('express-cache-response');

const clientResource = path.join(__dirname, 'build');
const app = express();

app.use(cache())

app.use(express.static(path.join(clientResource)));

app.get('/*', function(req, res) {
  res.sendFile(path.join(clientResource, 'index.html'));
});

app.listen(process.env.PORT || 4000);

