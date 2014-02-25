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


exports.getProf = function(socket, session) {
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
			session.reload(function() {
				session.userId = result.rows[0].prof_id;
				session.isProf = true;
				session.touch().save();
			});
			
            socket.emit('foundProf', result.rows[0]);
        });
    });
};

exports.addCourse = function(socket, course, session) {
	pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
		//need to setup query variables as strings if they are to be used as VARCHARS in the DB
		var queryVars = "'" + course.courseNum + "', '" + course.section + "', '" + course.courseName + "', " + session.userId + ", '" + course.times + "'";
		
        client.query( ("SELECT * FROM addCourse(" + queryVars + ");") , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('courseAdded', result.rows[0].courseId);
        });
    });
};

exports.getCourseInfo = function(socket, courseId) {
	pg.connect(pgHost, function(err, client, done) {
        console.log(courseId);
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
        client.query( ("SELECT * FROM COURSES WHERE course_id = " + courseId + ";") , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('returnCourseInfo', result.rows[0]);
        });
    });
};

exports.updateCourse = function(socket, courseId, course) {
	pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
		//need to setup query variables as strings if they are to be used as VARCHARS in the DB
		var queryVars = "'" + courseId + "', '" + course.courseNum + "', '" + course.section + "', '" + course.courseName + "', '" + course.times + "'";
		
        client.query( ("SELECT * FROM updateCourse(" + queryVars + ");") , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('courseUpdated', result);
        });
    });
};

exports.deleteCourse = function(socket, courseId) {
	pg.connect(pgHost, function(err, client, done) {
		
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		client.query( ("SELECT * FROM deleteCourse(" + courseId.courseId + ")") , function(err, result) {
			done();
			
			if (err) {
				return console.error('error running query', err);
			}
			
			socket.emit('courseDeleted');
		});
	});
};

exports.getCourses = function(socket) {
    pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
		client.query("SELECT C.course_id, C.course_number, C.course_section, C.course_name, P.name, C.class_times FROM PROFESSORS P, COURSES C WHERE C.prof_id = P.prof_id" , function(err, result) {
        // client.query("SELECT C.course_number, C.course_section, C.course_name, P.name, C.class_times FROM STUDENTS S, PROFESSORS P, COURSES C, Enrolled E WHERE S.student_id = E.student_id AND E.course_id = C.course_id AND C.prof_id = P.prof_id AND S.student_id = 1" , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }

            socket.emit('foundCourses', result);
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

exports.profAddAssignment = function(socket,data) {
    pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
               // console.log(data + "");
               // var querystring = "SELECT C.course_number FROM COURSES C, PROFESSORS P WHERE C.prof_id = P.prof_id AND P.username = \'" + data.username + "\'";

       // client.query(querystring, function(err, result) {
         //   done();  // release the client back to the pool

           // if (err) {
             //   return console.error('error running query', err);
           // }

            socket.emit('Assignemnt Added', result);
        });
    });
};
