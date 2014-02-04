
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
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


/**
*	Testing out server functionality
*/
var dbUrl = "tcp://umplishk:toronto@localhost/test";

function disconnectAll(client) {
	console.log('Closing client connection');
	client.end();
}

function getStudent(onDone) {
	var ret;
	
}

app.get('/student', function(req, res){
	pg.connect(dbUrl, function(err, client) {
		client.query("SELECT * FROM STUDENTS", function(err, result) {
			console.log("Row count: %d", result.rows.length);
			
			res.json(result.rows[0]);
			disconnectAll(client);
		});
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
