var should = require ('should');

var	io = require('socket.io-client');
var socketUrl = 'http://localhost:8080';

var options = {transports: ['websocket'], 'force new connection': true, 'cookie': 'express.sid=s:test'};

var assert = require("assert");

describe('serverTests', function() {

	it('should make a test connection and receieve test back',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('testios', {isTest: true, test: 'test'});
		});
		
		client.on('test', function(data) {
			(data.test).should.be.type('string');
			data.test.should.equal('test');
			client.disconnect();
			done();
		});
	});
	
	it('should get first student in database',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('getStudent', {isTest: true, studentId: '1'});
		});
		
		client.on('foundStudent', function(data) {
			data.should.be.ok;
			
			data.student_id.should.be.ok;
			data.username.should.be.ok;
			data.first_name.should.be.ok;
			data.last_name.should.be.ok;
			data.email.should.be.ok;
			data.password.should.be.ok;
			data.settings_id.should.be.ok;
			
			data.student_id.should.equal('1');
			data.username.should.equal('umplishk');
			data.first_name.should.equal('Alexander');
			data.last_name.should.equal('Plishka');
			data.email.should.equal('umplishk@myumanitoba.ca');
			data.password.should.equal('password');
			data.settings_id.should.equal('1');
			
			client.disconnect();
			done();
		});
	});
	
	it('should get list of all courses and first course should exist',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('getCourses', {isTest: true});
		});
		
		client.on('foundCourses', function(data) {
			data.should.be.ok;
			
			data.rowCount.should.be.above(0);
			data.rows.should.be.ok;
			
			var first = data.rows[0];
			first.should.be.ok;
			
			client.disconnect();
			done();
		});
	});
	
	it('should get prof from database',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('getProf', {isTest: true, profId: '1'});
		});
		
		client.on('foundProf', function(data) {
			data.should.be.ok;
			
			data.prof_id.should.be.ok;
			data.username.should.be.ok;
			data.name.should.be.ok;
			data.office_hours.should.be.ok;
			data.email.should.be.ok;
			data.password.should.be.ok;
			data.settings_id.should.be.ok;
			
			data.prof_id.should.equal('1');
			data.username.should.equal('cszapp');
			data.name.should.equal('Michael Zapp');
			data.office_hours.should.equal('None');
			data.email.should.equal('zapp@cs.umanitoba.ca');
			data.password.should.equal('password');
			data.settings_id.should.equal('2');
			data.is_ta.should.not.be.ok;
			
			client.disconnect();
			done();
		});
	});
});

describe('addUpdateDeleteCourse', function(){
	
	it('add course and check it is in list', function(done) {
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
				
				//must then delete course
				client.emit('deleteCourse', {isTest: true, courseId: data.rows[0].addcourse});
				client.on('courseDeleted', function(data) {
					client.disconnect();
					done();
				});
			});
		});
	});
	
	it('add course and then update it', function(done) {
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
				
				//now update course
				client.emit('updateCourse', {isTest: true, courseId: cId,
										courseName: 'New Test Course Name',
										courseNum: 'TEST 1001',
										section: 'A01',
										times: 'Online'});
				client.on('courseUpdated', function(data) {
					data.should.be.ok;
					data.rows[0].updatecourse.should.equal(true);
					
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
	
	it('add course then get course info', function(done) {
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
				
				//now verify course info before deleting
				client.emit('getCourseInfo', {isTest: true, courseId: cId});
				client.on('returnCourseInfo', function(course) {
					course.should.be.ok;					
					course.course_id.should.equal('' + cId);
					course.course_name.should.equal('Test Course');
					course.course_number.should.equal('TEST 1001');
					course.course_section.should.equal('A01');
					course.class_times.should.equal('Online');
					course.prof_id.should.equal('1');
				
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
	
	it('add course and update it then get course info', function(done) {
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
				
				//now update course
				client.emit('updateCourse', {isTest: true, courseId: cId,
										courseName: 'New Test Course Name',
										courseNum: 'TEST 1002',
										section: 'A02',
										times: 'Online'});
				client.on('courseUpdated', function(data) {
					//now verify course info before deleting
					client.emit('getCourseInfo', {isTest: true, courseId: cId});
					client.on('returnCourseInfo', function(course) {
						course.should.be.ok;					
						course.course_id.should.equal('' + cId);
						course.course_name.should.equal('New Test Course Name');
						course.course_number.should.equal('TEST 1002');
						course.course_section.should.equal('A02');
						course.class_times.should.equal('Online');
						course.prof_id.should.equal('1');
					
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
	
	
	describe('calendarTests', function() {
		var cId;
		it('add course then add one assignment and then get list of assignments for course', function(done) {
			var client = io.connect(socketUrl, options);
			
			client.on('connect', function(data) {
				client.emit('addCourse', {isTest: true, userId: '1', isProf: true,
											courseName: 'Test Course',
											courseNum: 'TEST 1001',
											section: 'A01',
											times: 'Online'});
				
				client.on('courseAdded', function(data) {
					data.should.be.ok;
					cId = data.rows[0].addcourse;
					cId.should.be.ok;
					
					client.emit('profAddAssignment', {assignmentTitle: "a1",
														course: "TEST 1001",
														dueDate: "03/26/2014 06:30 PM",
														file: "readme contents",
														name: "Readme.txt",
														releaseDate: "03/25/2014 06:30 PM",
														size: "16",
														type: "text/plain"});
					client.on('ProfAssignmentSubmitted', function(data) {
						data.should.be.ok;
						
						client.emit('getAssignmentsForCourse', {course_id: cId});
						client.on('foundAssignments', function(data) {
							data.should.be.ok;
							
							data[0].course_number.should.equal('TEST 1001');
							data[0].assignment_name.should.equal('a1');
							data[0].viewable_date.should.equal("03/25/2014 06:30 PM");
							data[0].due_date.should.equal("03/26/2014 06:30 PM");							
							
							//leave course for next test
							client.disconnect();
							done();
						});
					});
				});
			});
		});
		
		it('add course then add multiple assignments and then get list of assignments for course', function(done) {
			var client = io.connect(socketUrl, options);
			
			client.on('connect', function(data) {
				cId.should.be.ok;
				
				client.emit('profAddAssignment', {assignmentTitle: "a2",
													course: "TEST 1001",
													dueDate: "03/28/2014 06:30 PM",
													file: "readme contents",
													name: "Readme.txt",
													releaseDate: "03/27/2014 06:30 PM",
													size: "16",
													type: "text/plain"});
				client.on('ProfAssignmentSubmitted', function(data) {
					data.should.be.ok;
					
					client.emit('getAssignmentsForCourse', {course_id: cId});
					client.on('foundAssignments', function(data) {
						data.should.be.ok;
						
						data[0].course_number.should.equal('TEST 1001');
						data[0].assignment_name.should.equal('a1');
						data[0].viewable_date.should.equal("03/25/2014 06:30 PM");
						data[0].due_date.should.equal("03/26/2014 06:30 PM");
						
						data[1].course_number.should.equal('TEST 1001');
						data[1].assignment_name.should.equal('a2');
						data[1].viewable_date.should.equal("03/27/2014 06:30 PM");
						data[1].due_date.should.equal("03/28/2014 06:30 PM");							
						
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


