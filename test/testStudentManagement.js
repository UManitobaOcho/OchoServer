var should = require ('should');

var	io = require('socket.io-client');
var socketUrl = 'http://localhost:8080';

var options = {transports: ['websocket'], 'force new connection': true, 'cookie': 'express.sid=s:test'};

var assert = require("assert");

describe('addStudent', function(){

	// it('should make a test connection and receieve test back',function(done) {
	// 	var client = io.connect(socketUrl, options);
		
	// 	client.on('connect', function(data) {
	// 		client.emit('testios', {test: 'test'});
	// 	});
		
	// 	client.on('test', function(data) {
	// 		(data.test).should.be.type('string');
	// 		data.test.should.equal('test');
	// 		client.disconnect();
	// 		done();
	// 	});
	// });
	
	// it('should get student not in database',function(done) {
	// 	var client = io.connect(socketUrl, options);
		
	// 	client.on('connect', function(data) {
	// 		client.emit('getStudNotInCourse', {strClass: '1'});
	// 	});
		
	// 	client.on('foundStudNotInCourse', function(data) {
	// 		data.should.be.ok;
	// 		data.rowCount.should.be(1);
	// 		data.rows.should.be.ok;

	// 		var first = data.rows[0];
	// 		data[0].username.should.be.ok;
	// 		data[0].first_name.should.be.ok;
	// 		data[0].last_name.should.be.ok;
			
			
	// 		data[0].username.should.equal('umbluresf');
	// 		data[0].first_name.should.equal('Blurender');
	// 		data[0].last_name.should.equal('sfrenickoistic');

	// 		client.disconnect();
	// 		done();
	// 	});
	// });
});
