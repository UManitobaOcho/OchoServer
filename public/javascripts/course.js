var hostUrl = window.location.host;
var socket = io.connect(hostUrl);

var addPath = "/AddCourse";
var updatePath = "/UpdateCourse";


$(document).ready(function () { 
	$('#startTime').timepicker();
	$('#endTime').timepicker();
	
	if(window.location.pathname == addPath) {
		$('.submitBtn').click( function() { 
			addCourse()
		});
	} else if(window.location.pathname == updatePath) {
		setupUpdatePage();		
	}
});

function setupUpdatePage() {
	//TODO: replace updateCourse variable with session variable when sessions working
	socket.emit('getCourseInfo', {courseId: 1});
	socket.on('returnCourseInfo', function(course) {
		setCourseInfo(course);
		setWatermarks(course);
		
		if(course.class_times == "online") {
			$('#onlineCourse').prop('checked', true);
		} else {
			setClassTimes(course.class_times);			
		}
	});
		
	$('.submitBtn').click( function() {
		updateCourse(1) 
	});
};

function setCourseInfo(course) {
	$('input#courseName').val(course.course_name);
	$('input#courseNum').val(course.course_number);
	$('input#section').val(course.course_section);
};

function setClassTimes(times) {
	var split = times.split(" ");
	var days = split[0].split("");
	
	//check the appropriate boxes for days based on class_times days string split
	for(var i = 0; i < days.length; i++) {
		$('#' + days[i]).prop('checked', true);
	}
	
	//set the start and end time inputs based on split array
	$('#startTime').val(split[1] + " " + split[2]);
	$('#endTime').val(split[4] + " " + split[5])
};

function setWatermarks(data) {
	jQuery(function($) {
		$('input#courseName').watermark(data.course_name);
		$('input#courseNum').watermark(data.course_number);
		$('input#section').watermark(data.course_section);
		
		$.watermark.showAll();
	});
};

/**
*	Attempt to validate all course input fields first.
*	If successful then emit to server.
*/
function addCourse() {
	if( validateCourseFields() ) {		
		var classTimes = getClassTimes();
		
		if(classTimes != undefined) {			
			socket.emit('addCourse',   {courseName: $('input#courseName')[0].value,
										courseNum: $('input#courseNum')[0].value,
										section: $('input#section')[0].value,
										times: classTimes}
			);
			socket.on('courseNotAdded', function() {
				alert('not added');
			});		
			socket.on('courseAdded', function() {
				document.location.href = "/";
			});
		}
	}
};

function updateCourse(cId) {
	if( validateCourseFields() ) {		
		var classTimes = getClassTimes();
		
		if(classTimes != undefined) {			
			socket.emit('updateCourse',   {courseId: cId,
										courseName: $('input#courseName')[0].value,
										courseNum: $('input#courseNum')[0].value,
										section: $('input#section')[0].value,
										times: classTimes}
			);
			socket.on('courseNotUpdated', function() {
				alert('not added');
			});		
			socket.on('courseUpdated', function() {
				document.location.href = "/";
			});
		}
	}
};

function validateCourseFields() {
	var valid = true;
	
	if($('input#courseName')[0].value.length <= 1) {
		alert('not okay');
		valid = false;
	}
	if($('input#courseNum')[0].value.length != 9) {
		alert('not okay');
		valid = false;
	}
	if($('input#section')[0].value.length != 3) {
		alert('not okay');
		valid = false;
	}
	
	return valid;
};

function getClassTimes() {
	if($('input#onlineCourse').is(':checked')) {
	
		return 'online';
	} else if( validateTimes() ){	
		
		return classTimeToString();
	}
};

/**
*	Validate the chosen time using a regular expression that checks if time is of format {(?)?:?? am|pm}
*	Also validate whether there are days chosen for the class time
*/
function validateTimes() {
	var valid = true;
	var regex = /^\d{1,}:\d{2} \s?(AM|PM|am|pm)?$/m;
	
	if(!regex.test($('input#startTime')[0].value)) {
		alert('not okay');
		valid = false;
	}
	
	if(!regex.test($('input#endTime')[0].value)) {
		alert('not okay');
		valid = false;
	}
	
	//start and end time cannot be the same
	if( ($('input#startTime')[0].value).localeCompare( $('input#endTime')[0].value ) == 0 ) {
		alert('not okay');
		valid = false;
	}

	//check if atleast one day is selected
	if($('input.daysCheckbox:checked').length <= 0) {
		alert('not okay');
		valid = false;
	}
	
	return valid; 
};

function classTimeToString() {
	var result = "";
	var days = $('input.daysCheckbox:checked');
	
	for(var i = 0; i < days.length; i++) {
		result += days[i].value;
	}
	
	result += (" " + $('input#startTime')[0].value + " - " + $('input#endTime')[0].value);

	return result;
};
    