var pg = require('pg');
var pgHost = "postgres://ocho:ocho@localhost/OchoDb";

exports.getStudent = function(socket) {
    pg.connect(pgHost, function(err, client, done) {
    
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
        client.query("SELECT * FROM STUDENTS", function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('foundStudent', result.rows[0]);
        });
    });
};


exports.getProf = function(socket) {
    pg.connect(pgHost, function(err, client, done) {
		
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("SELECT * FROM PROFESSORS", function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
			
			//set into session
			socket.handshake.userId = result.rows[0].prof_id;
			socket.handshake.isProf = true;
			
            socket.emit('foundProf', result.rows[0]);
        });
    });
};

exports.addCourse = function(socket, course) {
	pg.connect(pgHost, function(err, client, done) {
        console.log(course);
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
		var queryVars = "'" + course.courseId + "', '" + course.section + "', '" + course.courseName + "', '" + course.times.classTimes + "'";
        client.query( ("SELECT * FROM addCourse(" + queryVars + ");") , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('courseAdded', result.rows[0].courseId);
        });
    });
};

exports.getCourses = function(socket) {
    pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }

        client.query("SELECT C.course_number, C.course_section, C.course_name, P.name, C.class_times FROM STUDENTS S, PROFESSORS P, COURSES C, Enrolled E WHERE S.student_id = E.student_id AND E.course_id = C.course_id AND C.prof_id = P.prof_id AND S.student_id = 1" , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('foundCourses', result.rows[0]);
        });
    });
};

exports.getProfCourses = function(socket,data) {
    pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
		console.log(data + "");	
		var querystring = "SELECT C.course_number FROM COURSES C, PROFESSORS P WHERE C.prof_id = P.prof_id AND P.username = \'" + data.username + "\'";

        client.query(querystring, function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('foundProfCourses', result);
        });
    });
};
