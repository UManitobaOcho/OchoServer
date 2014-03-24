//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);



$(function() {
	socket.emit('getCourseInfo');
	socket.on('returnCourseInfo', function(course) {
		setCourseInfo(course);
		loadCalendar(course);
	});
	
	loadHome();

	$('#homeBtn').click(function() {
		setActive($(this));
		loadHome();
	});
	$('#gradeBtn').click(function() {
		setActive($(this));
		loadGrades();
		loadGradesDetails();
	});	
});

function dateFromDayInMilliseconds(year, day) {
	var date = new Date(year, 0);
	date = new Date(date.setDate(day));
	
	return date.getTime();
}

function createEventsForDay(events, offset, times) {
	var d = new Date(2014, 0, 1, 0, 0, 0, 0);
	var day = 0; 
	// check if first of the month is a Sunday, if so set date to the second 
	if (d.getDay() == 0) {
		day = 2;
		d = d.setDate(day);
		d = new Date(d);
	} // check if first of the month is a Monday, if so return the date, otherwise get to the Monday following the first of the month 
	else if (d.getDay() != 1) {
		day = 9 - (d.getDay());
		d = d.setDate(day);
		d = new Date(d);
	}
	
	for(day = d.getDate() + offset; day < 365; day+=7) {
		var classDate = dateFromDayInMilliseconds(2014, day); 
		events.push({
			"id": day,
			"title": "Class Time: " + times,
			"url": "http://example.com",
			"class": "event-info",
			"start": classDate, // Milliseconds
			"end": classDate // Milliseconds
		});
	}
	
	return events;
}

function createDatesForClassTimes(times) {
	var events = [];
	
	var split = times.split(" ");
	var daysSplit = split[0].split("");
	
	for(var i = 0; i < daysSplit.length; i++) {
		var day = daysSplit[i];
		if(day == "M") {
			events = createEventsForDay(events, 0, times);
		} else if(day == "T") {
			events = createEventsForDay(events, 1, times);
		} else if(day == "W") {
			events = createEventsForDay(events, 2, times);
		} else if(day == "R") {
			events = createEventsForDay(events, 3, times);
		} else if(day == "F") {
			events = createEventsForDay(events, 4, times);
		}
	}
	
	return events;
}

function loadCalendar(course) {		
	var events = [];
	
	if(course.class_times != "Online") {
		events = createDatesForClassTimes(course.class_times);
	}
	
	socket.emit('getAssignmentsForCourse', {course_id: course.course_id});
	socket.on('foundAssignments', function(data) {
		
		events = createEventsForAssignments(data, events);
		
		var calendar = $('#calendar').calendar({ modal: "#events-modal", events_source: events, onAfterViewLoad: function(view) {
			$('.calendar-header').text(this.getTitle());
			}
		});
		
		$('.btn-group button[data-calendar-nav]').each(function() {
			var $this = $(this);
			$this.click(function() {
			calendar.navigate($this.data('calendar-nav'));
		});
	});
	});	
}

function createEventsForAssignments(data, events) {
	//for each assignment convert it into a calendar event
	for(var i = 0; i < data.length; i++) {
		var dueDate = new Date(data[i].due_date);
		var viewableDate = new Date(data[i].viewable_date);
		
		if(viewableDate < new Date()) {		
			dueDate.setFullYear(2014);
			dueDate = dueDate.getTime();
			events.push({
				"id": data[i].assignment_id,
				"title": data[i].assignment_name + " is due",
				"url": "http://example.com",
				"class": "event-important",
				"start": dueDate, // Milliseconds
				"end": dueDate // Milliseconds
			});
		}
	}
		
	return events;
}

function loadGradesDetails() {

	socket.emit('getUserType');
	socket.on('returnUserType', function(data) {
		if (data.userType === 0) {
			console.log('Student');
			/* Student View */
			socket.emit('getCourseInfo');
			socket.on('returnCourseInfo', function(course) {
				// I would like to get enrolled_id with student_id = 1 & course_id = course.course_id
				socket.emit('getEnrolledID', { student_id: 1,
											   course_id: course.course_id });
				socket.on('foundEnrolledID', function(data) {
					// Now, I can emit getCompletedTests and submittedTest
					socket.emit('getCompletedTests', data.enrolled_id);
					socket.on('foundCompletedTests', function(data) {
						var table = 
							"<div class=\"table-responsive\">" +
							"	<table class=\"table table-striped\">" +
							"		<thead>" +
							"			<tr>" +
							"				<td>Test Name</td>" +
							"				<td>Test Marks</td>" +
							"			</tr>" +
							"		</thead>" +
							"		<tbody>";
            

						for (var i = 0; i < data.length; i++) {
							table += "<tr>" +
									"	<td>Test " + data[i].test_id + "</td>" + 
									"	<td>" + data[i].grade + "</td>" +
									"</tr>";
						}

						table += 
							"		</tbody>" +
							"	</table>" +
							"</div>";

						$("#grades").append(table);
					});

					socket.emit('getSubmittedAssignment', data.enrolled_id);
					socket.on('foundSubmittedAssignment', function(data) {
						var table = 
							"<div class=\"table-responsive\">" +
							"	<table class=\"table table-striped\">" +
							"		<thead>" +
							"			<tr>" +
							"				<td>Assignment Name</td>" +
							"				<td>Assignment Grade</td>" +
							"			</tr>" +
							"		</thead>" +
							"		<tbody>";
            

						for (var i = 0; i < data.length; i++) {
							table += "<tr>" +
									"	<td>Test " + data[i].assignment_id + "</td>" + 
									"	<td>" + data[i].grade + "</td>" +
									"</tr>";
						}

						table += 
							"		</tbody>" +
							"	</table>" +
							"</div>";

						$("#grades").append(table);
					});
				});
			});
			
		} else {
			/* Professor View */
		}
	});
}

function loadHome(){
	$('.calendar-header').removeClass('displayNone');
	$('#calendar').removeClass('displayNone');
	$('.pull-right.form-inline').removeClass('displayNone');
	$('.grades-header').addClass('displayNone');
	$('#grades').addClass('displayNone');

	$('.content').html('<p> </p>');
}

function loadGrades(){
	$('.calendar-header').addClass('displayNone');
	$('#calendar').addClass('displayNone');
	$('.pull-right.form-inline').addClass('displayNone');
	$('.grades-header').removeClass('displayNone');
	$('#grades').removeClass('displayNone');

//	$('.content').html('<p> GRADES </p>');
}

function setActive(clicked){
	$('.nav-sidebar > li').removeClass('active');
	clicked.addClass('active');
}

function setCourseInfo(course){
	var h1 = '<h1.page-header>' + course.course_number + ': ' + course.course_name + '  (' + course.course_section + ') </h1>';
	$('.page-header').html(h1);
}
