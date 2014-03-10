    var pg = require('pg');
var pgHost = "postgres://ocho:ocho@localhost/OchoDb";

exports.getStudent = function(socket, res) {
    pg.connect(pgHost, function(err, client, done) {
    
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
        client.query("SELECT * FROM STUDENTS", function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
            res(result.rows[0]);

            //return JSON.stringify(result.rows[0]);

            //socket.emit('foundStudent', result.rows[0]);
        });
        return;
    });
    //return;
};


exports.getProf = function(socket, session, res) {
    return pg.connect(pgHost, function(err, client, done) {
		
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
				session.save();
			});
			res(result.rows[0]);
        });
    });
};

exports.addCourse = function(socket, course, session, res) {
	return pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
		var id = course.userId ? course.userId : session.userId;
		//need to setup query variables as strings if they are to be used as VARCHARS in the DB
		var queryVars = "'" + course.courseNum + "', '" + course.section + "', '" + course.courseName + "', " + id + ", '" + course.times + "'";
		
        client.query( ("SELECT * FROM addCourse(" + queryVars + ");") , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
			
            res(result);
        });
    });
};

exports.getCourseInfo = function(socket, courseId, res) {
	return pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
        client.query( ("SELECT * FROM COURSES WHERE course_id = " + courseId + ";") , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
			
            res(result.rows[0]); 
        });
    });
};

exports.updateCourse = function(socket, courseId, course, res) {
	return pg.connect(pgHost, function(err, client, done) {
        
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

            res(result);
            
        });
    });
};

exports.deleteCourse = function(socket, courseId,res) {
	return pg.connect(pgHost, function(err, client, done) {
		
		if (err) {
			return console.error('error fetching client from pool', err);
		}
		
		client.query( ("SELECT * FROM deleteCourse(" + courseId.courseId + ")") , function(err, result) {
			done();
			
			if (err) {
				return console.error('error running query', err);
			}
			res("success");
		});
	});
};

exports.getCourses = function(socket,res) {
    return pg.connect(pgHost, function(err, client, done) {
        
        if (err) {
            return console.error('error fetching client from pool', err);
        }
		
		client.query("SELECT C.course_id, C.course_number, C.course_section, C.course_name, P.name, C.class_times FROM PROFESSORS P, COURSES C WHERE C.prof_id = P.prof_id" , function(err, result) {
        // client.query("SELECT C.course_number, C.course_section, C.course_name, P.name, C.class_times FROM STUDENTS S, PROFESSORS P, COURSES C, Enrolled E WHERE S.student_id = E.student_id AND E.course_id = C.course_id AND C.prof_id = P.prof_id AND S.student_id = 1" , function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
            res(result);
            
        });
    });
};

exports.getProfCourses = function(socket,data,res) {
    return pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
		console.log(data + "");	
		var querystring = "SELECT C.course_number, C.course_id FROM COURSES C, PROFESSORS P WHERE C.prof_id = P.prof_id AND P.username = \'" + data.username + "\'";

        client.query(querystring, function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
            res(result);

            
        });
    });
};

exports.getStudNotInCourse = function(socket,data,res) {
    return pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        console.log(data + ""); 

        var querystring = "SELECT S.username, S.first_name, S.last_name, S.student_id FROM STUDENTS S WHERE student_id not in ( Select student_id from Enrolled E where E.course_id = \'" + data.course + "\')";

        client.query(querystring, function(err, result) {
            done();  // release the client back to the pool

            if (err) {
                return console.error('error running query', err);
            }
            res(result);
        });
    });
};

exports.addStudentToCourse = function(socket,data,res) {
    return pg.connect(pgHost, function(err, client, done) {
        if (err) {
            return console.error('error fetching client from pool', err);
        }
        console.log(data + "");
        var strStudent = data.student.split(',');
        var query = "";
        //var queryVars =  '" + course.courseNum + "', '" + course.section + "', '" + course.courseName + "', '" + course.times + "'";
        for(var i = 0; i < strStudent.length-1;i++)
        {
            //result.rows[0].course_id) + ", \'" + data.dueDate + "\', \'" + data.releaseDate + "\', \'" + data.assignTitle + "\', \'" + data.file + "\'";
            query = strStudent[i] + ", " + data.course;
            console.log(query);
            client.query( ( "Select * FROM addEnrolled(" + query + ");") , function(err, result) {
                done();

                if(err){
                    return console.error('error running query', err);
                }              
            });
        }
        res("success");  
    });
};

exports.profAddAssignment = function(socket,data,res) {
    return pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        
    	console.log(data.course);
    	var querystring1 = "SELECT C.course_id FROM COURSES C WHERE C.course_number = \'" + data.course + "\'";

    	client.query(querystring1, function(err, result){
    		done();

    		if(err){
    			return console.error('error running first query', err);
    		}

    		//console.log(result.rows[0].course_id);

    		var queryVars = (result.rows[0].course_id) + ", \'" + data.dueDate + "\', \'" + data.releaseDate + "\', \'" + data.assignmentTitle + "\', \'" + data.file + "\'";
    		
		console.log(queryVars + " ");

		client.query( ("SELECT * FROM addAssignment(" + queryVars + ");") , function(err, result) {
    			done();

    			if(err){
    				return console.error('error running second query', err);
    			}

                	res(result);
    		});
    	});
    });
};


exports.getCourseAssignments = function(socket, courseID, res) {
    return pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        
    });
}

exports.studentSubmitAssignment = function(socket, courseID, studentID, res) {
    return pg.connect(pgHost, function(err, client, done) {

        if (err) {
            return console.error('error fetching client from pool', err);
        }
        
    });
};


exports.getStudentGrades = function(socket, courseID, studentID, res) {
  return pg.connect(pgHost, function(err, client, done) {

       if (err) {
           return console.error('error fetchng client from pool', err);
       }

       console.log(data + "");
       var querystring = "SELECT * FROM ENROLLED WHERE student_id = '1' AND course_id='1'";

       client.query(querystring, function(err, result) {
           done();

           if(err) {
               return console.error('error running query', err);
           }

           console.log(result.rows[0]);

           //res(result.rows[0]);
       });
   });
};
