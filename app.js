/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var pg = require('pg');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
// If we don't add /public to the path then we can access our stored node_modules
app.use(express.static(path.join(__dirname, '')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/**
*	Set up server
*/
var dbUrl = "tcp://ocho:ocho@localhost/OchoDb";

var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

//heartbeat();

io.sockets.on('connection', function(socket) {
	var dbUrl = "tcp://ocho:ocho@localhost/OchoDb";
	
	
	/**
	*	Database retrievals
	*/
	socket.on('getStudent', function(func) {
		pg.connect(dbUrl, function(err, client) {
			client.query("SELECT * FROM STUDENTS", function(err, result) {
				console.log("Row count: %d", result.rows.length);
				
				socket.emit('foundStudent', result.rows[0]);
				disconnectAll(client);
			});
		});		
	});
	
	socket.on('getProf', function(func) {
		pg.connect(dbUrl, function(err, client) {
			client.query("SELECT * FROM PROFESSORS", function(err, result) {
				console.log("Row count: %d", result.rows.length);
				
				socket.emit('foundProf', result.rows[0]);
				disconnectAll(client);
			});
		});		
	});
	
	socket.on('testios', function(data) {
		socket.emit('test', { test: 'test' });
	});

	setInterval(function() {socket.emit('heartbeat', {heart: 'beat'}); }, 5000);
	
});

function heartbeat(){
	io.sockets.emit('heartbeat', {heart: 'beat'});
//	setTimeout(heartbeat(), 10000);
}

function disconnectAll(client) {
	console.log('Closing client connection');
	client.end();
}
