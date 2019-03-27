
var WebSocketServer = require('websocket').server;
var socketRouter = require('./socketrouter');

module.exports = function(server){
    Object.keys(socketRouter).forEach((eachRouter) => {
        spawnSocket(server, eachRouter);
    })
}

function spawnSocket(server, path){
    var wsServer = new WebSocketServer({
        httpServer: server,
        path : path,
        //autoAcceptConnections: false
    });

    wsServer.on('request', function(request) {
        if (!originIsAllowed(request.origin)) {
            request.reject();
            console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
            return;
        }
        var connection = request.accept('echo-protocol', request.origin); 
        socketRouter[path](connection);
    });
}

function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
}