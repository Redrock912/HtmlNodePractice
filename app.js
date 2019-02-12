var express = require('express');
var app = express();
var serv = require('http').Server(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log('Server on..');

var socket_list = [];

var io = require('socket.io')(serv, {});
io.sockets.on('connection', function (socket) {
    console.log('socket connection');
    socket.id = Math.random();
    socket.x = 0;
    socket.y = 0;
    socket.number = "" + Math.floor(10 * Math.random());
    socket_list[socket.id] = socket;

    socket.on('disconnect', function () {
        delete socket_list[socket.id];
    })


    // socket.on('happy', function (data) {
    //     console.log('I am happy' + data.reason);
    // })
    //
    // socket.emit('serverMsg', {
    //     msg: 'hi'
    // });
});

setInterval(function () {
    var pack = [];
    for (var i in socket_list) {
        var socket = socket_list[i];
        socket.x++;
        socket.y++;
        pack.push({
            x: socket.x,
            y: socket.y,
            number: socket.id
        })

        // go over socket list to display all the sockets.
        for (var i in socket_list) {
            socket = socket_list[i];
            socket.emit('newPositions', pack);
        }
    }

}, 1000 / 25);

