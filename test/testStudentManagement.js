var should = require ('should');

var	io = require('socket.io-client');
var socketUrl = 'http://localhost:8080';

var options = {transports: ['websocket'], 'force new connection': true, 'cookie': 'express.sid=s:test'};

var assert = require("assert");

describe('addStudent', function(){

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
	
	it('should get student not in database',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('getStudNotInCourse', {isTest: true, course: '1'});
		});
		
		client.on('foundStudNotInCourse', function(data) {
			data.should.be.ok;
			data.rowCount.should.equal(1);
			data.rows.should.be.ok;

			var first = data.rows[0];
			first.username.should.be.ok;
			first.first_name.should.be.ok;
			first.last_name.should.be.ok;
			
			
			first.username.should.equal('umbluresf');
			first.first_name.should.equal('Blurender');
			first.last_name.should.equal('sfrenickoistic');

			client.disconnect();
			done();
		});
	});

	it('get added student enrolled in course',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('getStudInCourse', {isTest: true, course: '1'});
		});
		
		client.on('foundStudInCourse', function(data) {
			data.should.be.ok;
			data.rows.should.be.ok;

			var first = data.rows[0];
			first.username.should.be.ok;
			first.first_name.should.be.ok;
			first.last_name.should.be.ok;
			
			
			first.username.should.equal('umplishk');
			first.first_name.should.equal('Alexander');
			first.last_name.should.equal('Plishka');

			client.disconnect();
			done();
		});
	});

	it('Adding student to course',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('addStudentToCourse', {isTest: true, student:"3," , course: '1'});
		});
		
		client.on('addedStudent', function(data) {
			client.disconnect();
			done();
		});

		it('get added student enrolled in course',function(done) {
			var client = io.connect(socketUrl, options);
			
			client.on('connect', function(data) {
				client.emit('getStudInCourse', {isTest: true, course: '1'});
			});
			
			client.on('foundStudInCourse', function(data) {
				data.should.be.ok;
				data.rows.should.be.ok;

				var first = data.rows[3];
				first.username.should.be.ok;
				first.first_name.should.be.ok;
				first.last_name.should.be.ok;
				
				
				first.username.should.equal('umbluresf');
				first.first_name.should.equal('Blurender');
				first.last_name.should.equal('sfrenickoistic');

				client.disconnect();
				done();
			});
		});
	});

	it('remove student to course',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('removeStudentToCourse', {isTest: true, student:"3," , course: '1'});
		});
		
		client.on('removedStudent', function(data) {
			client.disconnect();
			done();
		});

		it('get added student not enrolled in course',function(done) {
			var client = io.connect(socketUrl, options);
			
			client.on('connect', function(data) {
				client.emit('getStudNotInCourse', {isTest: true, course: '1'});
			});
			
			client.on('foundStudNotInCourse', function(data) {
				data.should.be.ok;
				data.rows.should.be.ok;

				var first = data.rows[1];
				first.username.should.be.ok;
				first.first_name.should.be.ok;
				first.last_name.should.be.ok;
				
				
				first.username.should.equal('umbluresf');
				first.first_name.should.equal('Blurender');
				first.last_name.should.equal('sfrenickoistic');

				client.disconnect();
				done();
			});
		});
	});

	it('Adding and removing student to course',function(done) {
		var client = io.connect(socketUrl, options);
		
		client.on('connect', function(data) {
			client.emit('addStudentToCourse', {isTest: true, student:"3," , course: '1'});
		});
		
		client.on('addedStudent', function(data) {
			client.disconnect();
			done();
		});

		it('get added student enrolled in course',function(done) {
			var client = io.connect(socketUrl, options);
			
			client.on('connect', function(data) {
				client.emit('getStudInCourse', {isTest: true, course: '1'});
			});
			
			client.on('foundStudInCourse', function(data) {
				data.should.be.ok;
				data.rows.should.be.ok;

				var first = data.rows[3];
				first.username.should.be.ok;
				first.first_name.should.be.ok;
				first.last_name.should.be.ok;
				
				
				first.username.should.equal('umbluresf');
				first.first_name.should.equal('Blurender');
				first.last_name.should.equal('sfrenickoistic');

				client.disconnect();
				done();
			});
		});
		it('remove student to course',function(done) {
			var client = io.connect(socketUrl, options);
			
			client.on('connect', function(data) {
				client.emit('removeStudentToCourse', {isTest: true, student:"3," , course: '1'});
			});
			
			client.on('removedStudent', function(data) {
				client.disconnect();
				done();
			});

			it('get added student not enrolled in course',function(done) {
				var client = io.connect(socketUrl, options);
				
				client.on('connect', function(data) {
					client.emit('getStudNotInCourse', {isTest: true, course: '1'});
				});
				
				client.on('foundStudNotInCourse', function(data) {
					data.should.be.ok;
					data.rows.should.be.ok;

					var first = data.rows[1];
					first.username.should.be.ok;
					first.first_name.should.be.ok;
					first.last_name.should.be.ok;
					
					
					first.username.should.equal('umbluresf');
					first.first_name.should.equal('Blurender');
					first.last_name.should.equal('sfrenickoistic');

					client.disconnect();
					done();
				});
			});
		});
	});
});

