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


app.configure( function() {
	// Use port 80
	app.set('port', process.env.PORT || 80);
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
})


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

/**
*	Set up server
*/
var server = http.createServer(app);
//var io = require('socket.io').listen(server);

// Session Socket io
var SessionSockets = require('session.socket.io')
  , sessionSockets = new SessionSockets(io, sessionStore, cookieParser);

server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

sessionSockets.on('connection', function(err, socket, session) {
	var dbUrl = "tcp://ocho:ocho@localhost/OchoDb";

	/**
	*	Database retrievals
	*/
	socket.on('getStudent', function(func) {
		pg.connect(dbUrl, function(err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err);
			}

			client.query("SELECT * FROM STUDENTS", function(err, result) {
				// release the client back to the pool				
				done();

				if (err) {
					return console.error('error running query', err);
				}

				console.log("Row count: %d", result.rows.length);
				
				socket.emit('foundStudent', result.rows[0]);
			});
		});		
	});
	
	socket.on('getProf', function(func) {
		pg.connect(dbUrl, function(err, client, done) {
			if (err) {
				return console.error('error fetching client from pool', err);
			}

			client.query("SELECT * FROM PROFESSORS", function(err, result) {
				// release the client back to the pool
				done();

				if (err) {
					return console.error('error running query', err);
				}

				console.log("Row count: %d", result.rows.length);
				
				socket.emit('foundProf', result.rows[0]);
			});
		});		
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

