//var hostUrl = 'http://ec2-54-201-56-122.us-west-2.compute.amazonaws.com:8080/';
var hostUrl = "http://localhost:8080";

var socket = io.connect(hostUrl);

$(function() {
	$("#professor-btn").click( function(){ getProf() });
	$("#student-btn").click( function(){ getStudent() });
	$("#courses-btn").click( function(){ getCourses() });
});

function getStudent() {
	console.log("Getting Student");
	socket.emit('getStudent', {username: 'umplishk'});
	socket.on('foundStudent', function(student) {
		logIn(student);
	});
};

function getProf() {
	console.log("Getting Professor");
	socket.emit('getProf', {username: 'cszapp'});
	socket.on('foundProf', function(prof) {
		logIn(prof);
	});
};

function getCourses() {
	console.log("Getting Courses");
	socket.emit('getCourses', {username: 'umplishk'});
	socket.on('foundCourses', function(courses) {
		display_contents(courses);
	});
};

function logIn(user) {
	$('.username').text(user.username);

	$('.jumbotron p').hide();
	$('.user_details').show();
	$('.button_groups').show();
	$('.courses_list').hide();
	$('.logout').show();
};

function logout() {
	$('.jumbotron p').show();
	$('.user_details').hide();
	$('.button_groups').hide();
	$('.courses_list').hide();
	$('.logout').hide();
};

function display_contents(courses) {
	//$('.CourseNumber').text(courses.rows[0]);
	//$('.CourseSection').text(courses.rows[1]);
	//$('.CourseName').text(courses.rows[2]);
	//$('.ProfessorName').text(courses.rows[3]);
	//$('.ClassTime').text(courses.rows[4]);

	$('.courses_list').show();
};
