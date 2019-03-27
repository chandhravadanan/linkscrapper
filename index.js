
const http = require('http')
const express = require('express');
const path = require('path');
const cluster = require('cluster');
const os = require('os');
const socket = require('./server/webscoket');

const clientResource = path.join(__dirname, 'build');

if(cluster.isMaster){
  var numCpu = os.cpus().length;
  console.log('number of cpu : '+ numCpu);
  for(var i=0; i< numCpu; i++){
    cluster.fork();
  }
}else{
  const app = express();
  app.use(express.static(path.join(clientResource)));
  app.get('/', function(req, res) {
    res.sendFile(path.join(clientResource, 'index.html'));
  });
  var server = http.createServer(app)
  socket(server);
  server.listen(process.env.PORT || 4000);
}


