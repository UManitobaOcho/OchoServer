/**
 * Module dependencies.
 */

var express = require('express');
var controllers = require('./controllers');
var addCourse = require('./controllers/addCourse');
var addAssignment = require('./controllers/addAssignment');
var addStudent = require('./controllers/addStudent');
var removeStudent = require('./controllers/removeStudent');
var about = require('./controllers/about');
var courseHomepage = require('./controllers/courseHomepage');
var checkGrade = require('./controllers/checkGrade');
var viewAssignments = require('./controllers/viewAssignments');
var submitAnswer = require('./controllers/submitAnswer');

//need to change the max number of sockets so we can run our mocha tests
var http = require('http');
http.globalAgent.maxSockets = 1000;
http.Agent.defaultMaxSockets = 1000;

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
    app.use(express.session({ store: sessionStore, secret: 'secret', key: 'express.sid' }));

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
app.get('/CheckGrade', checkGrade.checkGrade);
app.get('/Course', courseHomepage.courseHomepage);
app.get('/ViewAssignments',viewAssignments.viewAssignments);
app.get('/RemoveStudent', removeStudent.removeStudent);
app.get('/SubmitAssignmentAnswer', submitAnswer.submitAnswer);

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
		
		var isTestOrIos = handshakeData.cookie['express.sid'] == 's:test';
		sessionStore.load(handshakeData.sessionID, function(err, session) {
			//if handshakeData.sessionID == false then we are doing a test and passed cookie with a sid that ends up as false
			if((err || !session) && !isTestOrIos) {				
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
	function downloadedAssignment(data) {
		socket.emit('AssignmentDownloaded', data);
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
	function foundStudInCourse(data){
		socket.emit('foundStudInCourse', data);
	}
	function AssignmentSubmitted(data){
		socket.emit('AssignmentSubmitted', data);
	}
	function ProfAssignmentSubmitted(data){
		socket.emit('ProfAssignmentSubmitted', data);
	}
	function addedStudent(data) {
		socket.emit('addedStudent', data);
	}
	function removedStudent(data) {
		socket.emit('removedStudent', data);
	}
	function foundEnrolledInfo(data) {
		socket.emit('returnEnrolledInfo', data);
	}
	function foundAssignments(data) {
		socket.emit('foundAssignments', data);
	}
	function foundSubmittedAssignment(data) {
		socket.emit('foundSubmittedAssignment', data);
	}
	function foundCompletedTests(data) {
		socket.emit('foundCompletedTests', data);
	}

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
        db.getProf(socket, data, session, foundProf);        
    });
	
	socket.on('addCourse', function(course) {
		
		if((course.userId ? course.isProf : session.isProf) == true) {
			db.addCourse(socket, course, session, courseAdded);
		} else {
			console.error('Error: not a professor, adding a course is unauthorized.');
		}
	});
	
	socket.on('getCourseInfo', function(data) {	
		db.getCourseInfo(socket, (data ? data.courseId : session.courseId), courseInfo);			
	});
	
	socket.on('updateCourse', function(course) {
		db.updateCourse(socket, (course.courseId ? course.courseId : session.courseId), course, updatedCourse);
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
    socket.on('getStudInCourse', function(data) {
    	db.getStudInCourse(socket, data, foundStudInCourse);
    });
    socket.on('addStudentToCourse', function(data) {
		db.addStudentToCourse(socket, data, addedStudent);
    });
	socket.on('removeStudentToCourse', function(data) {
		db.removeStudentToCourse(socket, data, removedStudent);
    });
    socket.on('profAddAssignment', function(data) {
		db.profAddAssignment(socket, data, ProfAssignmentSubmitted);
		
    });
    socket.on('studentSubmitAssignment', function(data){
    	db.studentSubmitAssignment(socket, data, AssignmentSubmitted)
    });

    socket.on('getEnrolledInfo', function(data) {
    	db.getStudentEnrolledInfo(socket, data.student_id, foundEnrolledInfo);
    });
	
	socket.on('getAssignmentsForCourse', function(data) {
		console.log(session);
		db.getAssignmentsForCourse(socket, (data ? data.course_id : session.course_id), foundAssignments);
	});

	socket.on('downloadAssignment', function(data) {
		db.downloadAssignment(socket, data.assignment_id, downloadedAssignment);
	});

	socket.on('getSubmittedAssignment', function(enrolledID) {
		db.getSubmittedAssignment(socket, enrolledID, foundSubmittedAssignment);
	});

	socket.on('getCompletedTests', function(enrolledID) {
		db.getCompletedTests(socket, enrolledID, foundCompletedTests);
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



