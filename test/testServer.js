var should = require ('should');

var	io = require('socket.io-client');
var socketUrl = 'http://localhost:8080';

var options = {transports: ['websocket'], 'force new connection': true, 'cookie': 'express.sid=s:test'};

var assert = require("assert");

describe('addCourse', function(){

	it('should make a test connection and receieve test back',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('testios', {test: 'test'});
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
			client.emit('getStudent', {studentId: '1'});
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
			client.emit('getCourses');
		});
		
		client.on('foundCourses', function(data) {
			data.should.be.ok;
			
			data.rowCount.should.be.above(0);
			data.rows.should.be.ok;
			
			var first = data.rows[0];
			first.should.be.ok;
			
			first.course_id.should.equal('1');
			first.course_number.should.equal('COMP 4350');
			first.course_section.should.equal('A01');
			first.course_name.should.equal('Software Engineering 2');
			first.name.should.equal('Michael Zapp');
			first.class_times.should.equal('TR 11:30 AM - 12:45 PM');
			
			client.disconnect();
			done();
		});
	});
	
	it('should get prof from database',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('getProf', {profId: '1'});
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
