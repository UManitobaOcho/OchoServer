/**
 * Module dependencies.
 */

var express = require('express');
var controllers = require('./controllers');
var addCourse = require('./controllers/addCourse');
var addAssignment = require('./controllers/addAssignment');
var addStudent = require('./controllers/addStudent');
var about = require('./controllers/about');
var courseHomepage = require('./controllers/courseHomepage');
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
app.get('/Course', courseHomepage.courseHomepage);

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
	function foundStudent(data) {
		socket.emit('foundStudent', data);
	}
	function foundProf(data){
		socket.emit('foundProf', data);
	}
	function courseAdded(data){
		socket.emit('courseAdded', data);
	}
	function courseInfo(data){
		socket.emit('returnCourseInfo', data);
	}
	function updatedCourse(data){
		socket.emit('courseUpdated', data);
	}
	function deletedCourse(data){
		if(data = "success") socket.emit('courseDeleted');
		else console.error("Course did not get deleted");
	}
	function foundCourseList(data){
		socket.emit('foundCourses', data);
	}
	function foundProfCourses(data){
		socket.emit('foundProfCourses', data);
	}
	function foundStudNotInCourse(data){
		socket.emit('foundStudNotInCourse', data);
	}
	function AssignmentSubmitted(data){
		socket.emit('AssignmentSubmitted', data);
	}
	function addedStudent(data) {
		socket.emit('addedStudent', data);
	}
//	function StudentGrades(data) {
//		socket.emit('StudentGrades', data);
//	}

	socket.on('setSessionVariable', function(variable) {
		session.reload(function() {
			eval('session.' + variable.varName + ' = ' + variable.varValue);
			session.touch().save();
		});
	});
	
    socket.on('getStudent', function(func) {
    	db.getStudent(socket, foundStudent);
    });

    socket.on('getProf', function(data) {
        db.getProf(socket, session, foundProf);        
    });
	
	socket.on('addCourse', function(course) {
		
		if(course.userId ? course.isProf : session.isProf == true) {
			db.addCourse(socket, course, session, courseAdded);
		} else {
			console.error('Error: not a professor, adding a course is unauthorized.');
		}
	});
	
	socket.on('getCourseInfo', function() {
		db.getCourseInfo(socket, session.courseId, courseInfo);			
	});

//	socket.on('getStudentGrades', function() {
//		db.getStudentGrades(socket, session.courseId, session.studentID, studentGrades);
//	});
	
	socket.on('updateCourse', function(course) {
		db.updateCourse(socket, session.courseId, course, updatedCourse);
	});
	
	socket.on('deleteCourse', function(courseId) {
		console.log(courseId);
		db.deleteCourse(socket, courseId, deletedCourse);
	});

    socket.on('getCourses', function() {
        db.getCourses(socket, foundCourseList);
    });

    socket.on('getProfCourses', function(data) {
		db.getProfCourses(socket,data, foundProfCourses);		
    });
    			
    socket.on('getStudNotInCourse', function(data) {
    	db.getStudNotInCourse(socket, data, foundStudNotInCourse);
    	
    });
    socket.on('addStudentToCourse', function(data) {
		db.addStudentToCourse(socket, data, addedStudent);
    });

    socket.on('profAddAssignment', function(data) {
		db.profAddAssignment(socket,data, AssignmentSubmitted);
		
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



