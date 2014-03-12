//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);

$(function() {
	socket.emit('getCourseInfo');
	socket.on('returnCourseInfo', function(course) {
		setCourseInfo(course);
	});
	
	loadHome();

	$('#homeBtn').click(function() {
		setActive($(this));
		loadHome();
	});
	$('#gradeBtn').click(function() {
		setActive($(this));
		loadGrades();
	});	
	
});

function loadHome(){
	$('.content').html('<p> HOME PAGE ! </p>');
}

function loadGrades(){
	$('.content').html('<p> GRADES </p>');
}

function setActive(clicked){
	$('.nav-sidebar > li').removeClass('active');
	clicked.addClass('active');
}

function setCourseInfo(course){
	var h1 = '<h1.page-header>' + course.course_number + ': ' + course.course_name + '  (' + course.course_section + ') </h1>';
	$('.page-header').html(h1);
}
