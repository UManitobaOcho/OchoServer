var hostUrl = window.location.host;
console.log(hostUrl);
var socket = io.connect(hostUrl);


$(document).ready(function () { 
	$('#startTime').timepicker();
	$('#endTime').timepicker();
	
	$('.submitBtn').click( function() { 
		addCourse() 
	});
});

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
	
		return {classTimes: 'online'};
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

	alert(result);
	return result;
};
    