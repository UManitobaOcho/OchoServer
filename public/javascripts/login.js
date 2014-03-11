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
		$('#add_course-btn').hide();
		$('#add_assignment-btn').hide();
		$('#add_student-btn').hide();
		logIn(student);
	});
};

function getProf() {
	console.log("Getting Professor");
	socket.emit('getProf', {username: 'cszapp'});
	socket.on('foundProf', function(prof) {
		logIn(prof);
				$('#grade-btn').hide();
                $('#add_course-btn').show();
                $('#add_assignment-btn').show();
                $('#add_student-btn').show();
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
	// $('.course_number').text(courses.course_number);
	// $('.course_section').text(courses.course_section);
	// $('.course_name').text(courses.course_name);
	// $('.prof_name').text(courses.name);
	// $('.class_time').text(courses.class_times);
	
	//define table stuff
	$('.courses_list').html("<br />");
	table = "<table class='table table-hover text-left'>";
	_table = "</table>";
	tr = "<tr>";
	_tr = "</tr>";
	td = "<td>";
	tdIdDisplayNone = "<td class='courseId'>";
	_td = "</td>";
	btnGroup = "<div class='btn-group'>";
	_btnGroup = "</div>";
	homeBtn = "<button id='homeBtn' type='button' class='btn btn-default btn-lg'> <span class='glyphicon glyphicon-home' /> </button>"; 
	editBtn = "<button id='editBtn' type='button' class='btn btn-default btn-lg'> <span class='glyphicon glyphicon-pencil' /> </button>";
	assignmentsBtn = "<button id='assignmentsBtn' type='button' class='btn btn-default btn-lg'> <span class='glyphicon glyphicon-tasks' /> </button>";
	deleteBtn = "<button id='deleteBtn' type='button' class='btn btn-default btn-lg'> <span class='glyphicon glyphicon-trash' /> </button>";

	editBtnGroup = btnGroup + homeBtn + editBtn + assignmentsBtn + deleteBtn + _btnGroup;
	
	//add rows to table
	for(var i = 0; i < courses.rowCount; i++) {
		$('.courses_list').append(
			table + tr + tdIdDisplayNone + courses.rows[i].course_id + _td +
						 td + courses.rows[i].course_number + _td +
						 td + courses.rows[i].course_name   + _td +
						 td + courses.rows[i].course_section+ _td +
						 td + courses.rows[i].name          + _td +
						 td + courses.rows[i].class_times   + _td +
						 td + editBtnGroup + _td +
			_tr + _table
		);
	}
	
	addTableBtnFuncs();
	$('.courses_list').show();
};

function addTableBtnFuncs() {
	$('td #homeBtn').click(function () {
		// Go to Course HomePage
		goToCourseHomePage( $(this).parent().parent().parent() );
	});
	$('td #editBtn').click(function () { 
		goToUpdatePage( $(this).parent().parent().parent() ); 
	});
	$('td #assignmentsBtn').click(function () {
		// Go to View Assignments HomePage
		goToAssignmentsPage( $(this).parent().parent().parent() );
	});
	$('td #deleteBtn').click(function () { 
	
		var tr = $(this).parent().parent().parent();		
		deleteCourse(tr); 
	});
};

function goToCourseHomePage(tr) {
	var cId = $("td.courseId", tr).text();
	socket.emit("setSessionVariable", {varName: 'courseId', varValue: cId});

	document.location.href = "/Course";
}

function goToUpdatePage(tr) {
	var cId = $("td.courseId", tr).text();
	socket.emit("setSessionVariable", {varName: 'courseId', varValue: cId});
	
	document.location.href = "/UpdateCourse";
};

function goToAssignmentsPage(tr) {
	var cId = $("td.courseId", tr).text();
	socket.emit("setSessionVariable", {varName: 'courseId', varValue: cId});

	document.location.href = "/ViewCourseAssignments";
}

function deleteCourse(tr) {
	//get courseId from td.courseId of the tr object that contains the current delete button
	var cId = $("td.courseId", tr).text();
	
	socket.emit('deleteCourse', {courseId: cId});
	socket.on('courseDeleted', function() {
		tr.remove();
	});
};
