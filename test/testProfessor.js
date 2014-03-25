var should = require ('should');
var io = require('socket.io-client');
var socketUrl = 'http://localhost:8080';
var options = {transports: ['websocket'], 'force new connection': true, 'cookie': 'express.sid=s:test'};
var assert = require("assert");

describe('ProfessorAssignmentTests', function() {
        it('add an assignment', function(done) {
                var client = io.connect(socketUrl, options);

                client.on('connect', function(data) {
                        client.emit('addCourse', {isTest: true, userId: '1', isProf: true,
                                                                courseName: 'Test Course',
                                                                   courseNum: 'TEST 1001',
                                                                           section: 'A01',
                                                                        times: 'Online'});

                        client.on('courseAdded', function(data) {
                                data.should.be.ok;
                                data.rowCount.should.equal(1);
                                var cId = data.rows[0].addcourse; 
				cId.should.be.ok;
				
                        	client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment Test",
                                        	course: "TEST 1001", name: "test.txt", type: "text", size: "10",
                                        	file: "123456789\n", releaseDate: "09/09/2014 02:56 PM",
                                        	dueDate: "09/09/2014 10:59 PM"});
				
                        	client.on('ProfAssignmentSubmitted', function(data) {
                                	data.should.be.ok;

                               		//must then delete course
                               		client.emit('deleteCourse', {isTest: true, courseId: cId});
                        	        client.on('courseDeleted', function(data) {
                	                        client.disconnect();
        	                                done();
	                                });

				});
			});
                });
	});
	
        it('add two assignments', function(done) {
                var client = io.connect(socketUrl, options);
		
                client.on('connect', function(data) {
                        client.emit('addCourse', {isTest: true, userId: '1', isProf: true,
                                                                courseName: 'Test Course',
                                                                   courseNum: 'TEST 1001',
                                                                           section: 'A01',
                                                                        times: 'Online'});
			
                        client.on('courseAdded', function(data) {
                                data.should.be.ok;
                                data.rowCount.should.equal(1);
				
				var cId = data.rows[0].addcourse;				
				cId.should.be.ok;
				
                                client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment Test",
                                                course: "TEST 1001", name: "test.txt", type: "text/plain", size: "10",
                                                file: "123456789\n", releaseDate: "09/09/2014 02:56 PM",
                                                dueDate: "09/09/2014 10:59 PM"});
				
                                client.on('ProfAssignmentSubmitted', function(data) {
                                        data.should.be.ok;
					
	                                client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment Test 2",
        	                                        course: "TEST 1001", name: "test2.txt", type: "text/plain", size: "20",
 	                                                file: "1234567891234567890\n", releaseDate: "09/09/2014 02:56 PM",
        	                                        dueDate: "09/09/2014 10:59 PM"});
	
                 	                client.on('ProfAssignmentSubmitted', function(data) {
                         	               data.should.be.ok;


                                	        //must then delete course
                                       		client.emit('deleteCourse', {isTest: true, courseId: cId});
                                        	client.on('courseDeleted', function(data) {
                                                	client.disconnect();
                                                	done();
						});
                                        });
                                });
                        });
                });
        });


        it('add and verify an assignment is added', function(done) {
                var client = io.connect(socketUrl, options);

                client.on('connect', function(data) {
                        client.emit('addCourse', {isTest: true, userId: '1', isProf: true,
                                                                courseName: 'Test Course',
                                                                   courseNum: 'TEST 1001',
                                                                           section: 'A01',
                                                                        times: 'Online'});

                        client.on('courseAdded', function(data) {
                                data.should.be.ok;
                                data.rowCount.should.equal(1);
                                var cId = data.rows[0].addcourse;
                                cId.should.be.ok;
				console.log("submitting assignment");
                                client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment To Verify",
                                                course: "TEST 1001", name: "testToVerify.txt", type: "text/plain", size: "10",
                                                file: "123456789\n", releaseDate: "09/09/2014 02:56 PM",
                                                dueDate: "09/09/2014 10:59 PM"});

                                client.on('ProfAssignmentSubmitted', function(data) {
                                        data.should.be.ok;

                                        client.emit('getAssignmentsForCourse', {course_id: cId});
                                        client.on('foundAssignments', function(data) {
	                                        data.should.be.ok;

                                                data[0].course_number.should.equal('TEST 1001');
                                                data[0].assignment_name.should.equal('Assignment To Verify');
                                                data[0].viewable_date.should.equal("09/09/2014 02:56 PM");
                                                data[0].due_date.should.equal("09/09/2014 10:59 PM");

                                        	//must then delete course
                                        	client.emit('deleteCourse', {isTest: true, courseId: cId});
                                        	client.on('courseDeleted', function(data) {
                                                	client.disconnect();
                                                	done();
						});
                                        });
                                });
                        });
                });
        });

        it('add two assignments and verify both', function(done) {
                var client = io.connect(socketUrl, options);

                client.on('connect', function(data) {
                        client.emit('addCourse', {isTest: true, userId: '1', isProf: true,
                                                                courseName: 'Test Course',
                                                                   courseNum: 'TEST 1001',
                                                                           section: 'A01',
                                                                        times: 'Online'});

                        client.on('courseAdded', function(data) {
                                data.should.be.ok;
                                data.rowCount.should.equal(1);
                                var cId = data.rows[0].addcourse;
                                cId.should.be.ok;

                                client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment To Verify",
                                                course: "TEST 1001", name: "testToVerify.txt", type: "text/plain", size: "10",
                                                file: "123456789\n", releaseDate: "09/09/2014 02:56 PM",
                                                dueDate: "09/09/2014 10:59 PM"});

                                client.on('ProfAssignmentSubmitted', function(data) {
                                        data.should.be.ok;
        	                        client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment To Verify2",
                	                                course: "TEST 1001", name: "testToVerify2.txt", type: "text/plain", size: "10",
                        	                        file: "123456789\n", releaseDate: "10/10/2014 02:56 PM",
                                	                dueDate: "10/10/2014 10:59 PM"});

	                               	client.on('ProfAssignmentSubmitted', function(data) {
                                        	data.should.be.ok;

                                        	client.emit('getAssignmentsForCourse', {course_id: cId});
                                        	client.on('foundAssignments', function(data) {
                                                	data.should.be.ok;

                                                	data[0].course_number.should.equal('TEST 1001');
                                                	data[0].assignment_name.should.equal('Assignment To Verify');
                                                	data[0].viewable_date.should.equal("09/09/2014 02:56 PM");
                                                	data[0].due_date.should.equal("09/09/2014 10:59 PM");
                                                        data[1].course_number.should.equal('TEST 1001');
                                                        data[1].assignment_name.should.equal('Assignment To Verify2');
                                                        data[1].viewable_date.should.equal("10/10/2014 02:56 PM");
                                                        data[1].due_date.should.equal("10/10/2014 10:59 PM");

                                                	//must then delete course
                       		                        client.emit('deleteCourse', {isTest: true, courseId: cId});
                                                	client.on('courseDeleted', function(data) {
                                                        	client.disconnect();
                                                        	done();
                                                	});
						});
                                        });
                                });
                        });
                });
        });
});



