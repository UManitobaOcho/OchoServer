/**
 * Module dependencies.
 */

var express = require('express');
var controllers = require('./controllers');
var addCourse = require('./controllers/addCourse');
var addAssignment = require('./controllers/addAssignment');
var addStudent = require('./controllers/addStudent');
var about = require('./controllers/about');
var http = require('http');
var path = require('path');
var pg = require('pg');
var cookie = require("cookie");
var connect = require("connect");
var MemoryStore = express.session.MemoryStore;
var sessionStore = new MemoryStore();

/*
 * Other JS files
 */

//var db = require('./testdb');
var db = require('./db');

/* The server */
var app = express();

// all environments
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
    app.use(express.session({store: sessionStore, secret: 'secret', key: 'express.sid'}));
    // If we don't add /public to the path then we can access our stored node_modules
    app.use(express.static(path.join(__dirname, '')));
});

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//Load Controllers
app.get('/', controllers.index);
app.get('/AddCourse', addCourse.addCourse);
app.get('/UpdateCourse', addCourse.addCourse);
app.get('/AddAssignment', addAssignment.addAssignment);
app.get('/about', about.about);
app.get('/AddStudent', addStudent.addStudent);

/**
 *	Set up server
 */
var server = http.createServer(app);
var io = require('socket.io').listen(server);

server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

var Session = require('connect').middleware.session.Session;
io.set('authorization', function (handshakeData, accept) {
	
    if (handshakeData.headers.cookie) {
		
        handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
        handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');

        if (handshakeData.cookie['express.sid'] == handshakeData.sessionID) {
            return accept('Cookie is invalid.', false);
        }
		
		handshakeData.sessionStore = sessionStore;
		sessionStore.load(handshakeData.sessionID, function(err, session) {
			//if handshakeData.sessionID == false then we are doing a test and passed cookie with a sid that ends up as false
			if((err || !session) && handshakeData.sessionID != false) {				
				return accept('Error 1', false);
			} else {
				handshakeData.session = new Session(handshakeData, session);
				return accept(null, true);
			}
		});

    } else {
        return accept('No cookie transmitted.', false);
    }

    // accept(null, true);
});

io.sockets.on('connection', function(socket) {
	var session = socket.handshake.session;
	
	/**
	*	The function below allows us to set any variable into session by emitting 'setSessionVariable' 
	*	with a JSON object containing a variable name and value stored as strings
	*/
	socket.on('setSessionVariable', function(variable) {
		session.reload(function() {
			eval('session.' + variable.varName + ' = ' + variable.varValue);
			session.touch().save();
		});
	});
	
    socket.on('getStudent', function(func) {
        var result = db.getStudent(socket);
        socket.emit('foundStudent', result);
    });

    socket.on('getProf', function(data) {
        var result = db.getProf(socket, session);
        socket.emit('foundProf', result);
    });
	
	socket.on('addCourse', function(course) {
		if(session.isProf == true) {
			var result = db.addCourse(socket, course, session);
			socket.emit('courseAdded', result);
		} else {
			console.log('Error: not a professor, adding a course is unauthorized.');
		}
	});
	
	socket.on('getCourseInfo', function() {

		var result = db.getCourseInfo(socket, session.courseId);	
		socket.emit('returnCourseInfo', result);	
	});
	
	socket.on('updateCourse', function(course) {
		var result = db.updateCourse(socket, session.courseId, course);
		socket.emit('courseUpdated', result);
	});
	
	socket.on('deleteCourse', function(courseId) {
		var result = db.deleteCourse(socket, courseId);
		if(result == "success")
		{
			socket.emit('courseDeleted');
		}
		else
		{
			console.log('Error: course was not deleted');
		}
	});

    socket.on('getCourses', function() {
        var result = db.getCourses(socket);
        socket.emit('foundCourses', result);
    });

    socket.on('getProfCourses', function(data) {
		var result = db.getProfCourses(socket,data);
		socket.emit('foundProfCourses', result);
    });
    			
    socket.on('getStudNotInCourse', function(data) {
    	var result = db.getStudNotInCourse(socket, data);
    	socket.emit('foundStudNotInCourse', result);
    });

    socket.on('profAddAssignment', function(data) {
		var result = db.profAddAssignment(socket,data);
		socket.emit('AssignmentSubmitted', result);
    });
	
	socket.on('logout', function() {
		session.reload(function() {
			session.userId = null;
			session.isProf = null;
			session.save();
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



