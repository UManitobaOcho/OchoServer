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
                                data.rows[0].addcourse.should.be.ok;
 
                        	client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment Test",
                                        	course: "TEST 1001", name: "test.txt", type: "text", size: "10",
                                        	file: "123456789\n", releaseDate: "09/09/2014 02:56 PM",
                                        	dueDate: "09/09/2014 10:59 PM"});
				
                        	client.on('ProfAssignmentSubmitted', function(data) {
                                	data.should.be.ok;
                                	client.disconnect();
                                	done();
					
					//must then delete course
                                	client.emit('deleteCourse', {isTest: true, courseId: data.rows[0].addcourse});
                                	client.on('courseDeleted', function(data) {
                                        	client.disconnect();
                                        	done();
                        		});
				});
			});
                });
        });

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
                                data.rows[0].addcourse.should.be.ok;

                                client.emit('profAddAssignment', {isTest: true, assignmentTitle: "Assignment Test",
                                                course: "TEST 1001", name: "test.txt", type: "text", size: "10",
                                                file: "123456789\n", releaseDate: "09/09/2014 02:56 PM",
                                                dueDate: "09/09/2014 10:59 PM"});

                                client.on('ProfAssignmentSubmitted', function(data) {
                                        data.should.be.ok;
                                        client.disconnect();
                                        done();

                                        //must then delete course
                                        client.emit('deleteCourse', {isTest: true, courseId: data.rows[0].addcourse});
                                        client.on('courseDeleted', function(data) {
                                                client.disconnect();
                                                done();
                                        });
                                });
                        });
                });
        });

});

