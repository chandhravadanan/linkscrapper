
const express = require('express');
const path = require('path');
const app = express();

var clientResource = path.join(__dirname, '..', 'build');

app.use(express.static(path.join(clientResource)));

app.get('/*', function(req, res) {
  res.sendFile(path.join(clientResource, 'index.html'));
});

app.listen(4300);