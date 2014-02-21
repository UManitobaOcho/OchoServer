//var hostUrl = "http://localhost:8080"; 
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
};

function display_contents(courses) {
	// $('.course_number').text(courses.course_number);
	// $('.course_section').text(courses.course_section);
	// $('.course_name').text(courses.course_name);
	// $('.prof_name').text(courses.name);
	// $('.class_time').text(courses.class_times);
    $('.courses_list').html("<br />");
    table = "<table class='table table-hover text-left'>";
    _table = "</table>"
    tr = "<tr>";
    _tr = "</tr>";
    td = "<td>";
    _td = "</td>";
    $('.courses_list').append(
        table + tr + td + courses.course_number + _td +
                     td + courses.course_name   + _td +
                     td + courses.course_section+ _td +
                     td + courses.name          + _td +
                     td + courses.class_times   + _td +
        _tr + _table
    );
	$('.courses_list').show();
};
