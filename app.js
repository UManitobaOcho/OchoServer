/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var student = require('./routes/student');
var http = require('http');
var path = require('path');
var pg = require('pg');
var cookie = require("cookie");
var connect = require("connect");

/*
 * Other JS files
 */

var db = require('./db');

/* The server */
var app = express();


app.configure( function() {
    app.set('port', process.env.PORT || 8080);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.cookieParser());
    app.use(express.session({secret: 'secret', key: 'express.sid'}));
    // If we don't add /public to the path then we can access our stored node_modules
    app.use(express.static(path.join(__dirname, '')));
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/student', student.student);
app.get('/', routes.index);

/**
 *	Set up server
 */
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


io.set('authorization', function (handshakeData, accept) {

    if (handshakeData.headers.cookie) {

        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);

        handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

        if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
            return accept('Cookie is invalid.', false);
        }

    } else {
        return accept('No cookie transmitted.', false);
    }

    accept(null, true);
});

io.sockets.on('connection', function(socket) {
    db.url = "postgres://ocho:ocho@localhost/OchoDb";

    socket.on('getStudent', function(func) {
        db.getStudent(socket);
    });

    socket.on('getProf', function(data) {
        db.getProf(socket);
    });

    socket.on('testios', function(data) {
	socket.emit('test', { test: 'test' });
    });

    socket.on('error', function() {
	console.log('SOCKET ERROR');
	socket.destroy();
    });

    socket.on('close', function() {
	console.log('SOCKET CLOSED');
    });
});
