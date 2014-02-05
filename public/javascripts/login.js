var hostUrl = 'http://ec2-54-201-63-66.us-west-2.compute.amazonaws.com:3000';
var socket = io.connect(hostUrl);


function getStudent() {		
	socket.emit('getStudent', {username: 'umplishk'});
	socket.on('foundStudent', function(student) {
		logIn(student);
	});
};

function getProf() {
	socket.emit('getProf', {username: 'cszapp'});
	socket.on('foundProf', function(prof) {
		logIn(prof);
	});
};


function logIn(user) {
	$('.username').text(user.username);
	
	$('.jumbotron p').hide();
	$('.user_details').show();
	$('.logout').show();
};

function logout() {
	$('.jumbotron p').show();
	$('.user_details').hide();
	$('.logout').hide();
};