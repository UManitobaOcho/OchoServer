var hostUrl = window.location.host;
var socket = io.connect(hostUrl);

var isRoot = (location.pathname == "/");

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
	if(isRoot) {
		$('.jumbotron p').show();
		$('.user_details').hide();
		$('.button_groups').hide();
		$('.courses_list').hide();
		$('.logout').hide();		
	} else {
		document.location.href = "/";
	}
	
	socket.emit('logout');
};

function display_contents(courses) {
	$('.course_number').text(courses.course_number);
	$('.course_section').text(courses.course_section);
	$('.course_name').text(courses.course_name);
	$('.prof_name').text(courses.name);
	$('.class_time').text(courses.class_times);

	$('.courses_list').show();
};
