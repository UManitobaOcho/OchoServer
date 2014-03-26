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
		if(! $(this).hasClass('active')){
			setActive($(this));
			loadHome();
		}	
	});
	$('#gradeBtn').click(function() {
		if(! $(this).hasClass('active')){
			setActive($(this));
			loadGrades();
			//loadGradesDetails();
		}
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
	// Before start append new elements to #grades, clean it first
	$("#grades").html("");

	socket.emit('getUserType');
	socket.on('returnUserType', function(data) {
		if (data.userType === 0) {
			/* Student View */
			socket.emit('getCourseInfo');
			socket.on('returnCourseInfo', function(course) {
				// I would like to get enrolled_id with student_id = 1 & course_id = course.course_id
				socket.emit('getEnrolledID', { student_id: 1,
											   course_id: course.course_id });
				socket.on('foundEnrolledID', function(data) {
					// Now, I can emit getCompletedTests and getSubmittedAssignment
					socket.emit('getCompletedTests', data.enrolled_id);
					socket.on('foundCompletedTests', function(data) {
						var totalGrade = 0;
						var table = 
							"<div class=\"progress\" id=\"testProgress\">" +
							"</div>" +
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
							totalGrade += parseFloat(data[i].grade);
						}

						table += 
							"		</tbody>" +
							"	</table>" +
							"</div>";

						$("#grades").append(table);
						
						var averageGrade = (totalGrade / data.length).toFixed(0);
						var gradeProgress = 
	                        "<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"" + averageGrade + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:" + averageGrade + "%;\">" +
	                        "" + averageGrade + "" +
	                        "</div>";
    					$("#testProgress").append(gradeProgress); 
					});

					socket.emit('getSubmittedAssignment', data.enrolled_id);
					socket.on('foundSubmittedAssignment', function(data) {
						var totalGrade = 0;
						var table = 
							"<div class=\"progress\" id=\"assignmentProgress\">" +
							"</div>" +
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
									"	<td>Assignment " + data[i].assignment_id + "</td>" + 
									"	<td>" + data[i].grade + "</td>" +
									"</tr>";
							totalGrade += parseFloat(data[i].grade);
						}

						table += 
							"		</tbody>" +
							"	</table>" +
							"</div>";
						
						console.log(table);

						$("#grades").append(table);

						var averageGrade = (totalGrade / data.length).toFixed(0);
						var gradeProgress = 
	                        "<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"" + averageGrade + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:" + averageGrade + "%;\">" +
	                        "" + averageGrade + "" +
	                        "</div>";
    					$("#assignmentProgress").append(gradeProgress); 
					});
				});
			});
			
		} else {
			/* Professor View */
			socket.emit('getCourseInfo');
			socket.on('returnCourseInfo', function(course) {
				var testTable = 
							"<div class=\"table-responsive\">" +
							"	<table class=\"table table-striped\">" +
							"		<thead>" +
							"			<tr>" +
							"				<td>Student ID</td>" +
							"				<td>First Name</td>" +
							"				<td>Last Name</td>" +
							"				<td>Test Name</td>" +
							"				<td>Test Marks</td>" +
							"			</tr>" +
							"		</thead>" +
							"		<tbody id=\"testTable\">" +
							"		</tbody>" +
							"	</table>" +
							"</div>";
				$("#grades").append(testTable);

				var assignmentTable =
							"<div class=\"table-responsive\">" +
							"	<table class=\"table table-striped\">" +
							"		<thead>" +
							"			<tr>" +
							"				<td>Student ID</td>" +
							"				<td>First Name</td>" +
							"				<td>Last Name</td>" +
							"				<td>Assignment Name</td>" +
							"				<td>Assignment Marks</td>" +
							"			</tr>" +
							"		</thead>" +
							"		<tbody id=\"assignmentTable\">" +
							"		</tbody>" +
							"	</table>" +
							"</div>";
				$("#grades").append(assignmentTable);



				// After we get the courseInfo, we need to get list of students who registered this course
				socket.emit('getStudInCourse', {course: course.course_id});
				socket.on('foundStudInCourse', function(student) {
					for (var i = 0; i < student.rows.length; i++) {
						// For each student in courses, we would
						// like to find it's enrolled_id
						var studentID = student.rows[i].student_id;
						var studentFirstName = student.rows[i].first_name;
						var studentLastName = student.rows[i].last_name;

						socket.emit('getEnrolledID', { student_id: student.rows[i].student_id,
													   course_id: course.course_id });

						socket.on('foundEnrolledID', function(enrolled) {
							// After I found the enrolled_id, then we can use it
							// for getCompletedTests & getSubmittedAssignment

							socket.emit('getCompletedTests', enrolled.enrolled_id);
							socket.on('foundCompletedTests', function(data) {
								console.log('Called');
								for (var j = 0; j < data.length; j++) {
									var records = 	"<tr>" +
													"	<td>" + studentID + "</td>" +
													"	<td>" + studentFirstName + "</td>" +
													"	<td>" + studentLastName + "</td>" +
													"	<td>Test " + data[j].test_id + "</td>" + 
													"	<td>" + data[j].grade + "</td>" +
													"</tr>";
									$('#testTable').append(records);
								}
							});

							socket.emit('getSubmittedAssignment', enrolled.enrolled_id);
							socket.on('foundSubmittedAssignment', function(data) {
								// for student with student_id = student.rows[i].student_id
								for (var j = 0; j < data.length; j++) {
									var records = 	"<tr>" +
													"	<td>" + studentID + "</td>" + 
													"	<td>" + studentFirstName + "</td>" +
													"	<td>" + studentLastName + "</td>" +
													"	<td>Assignment " + data[j].assignment_id + "</td>" + 
													"	<td>" + data[j].grade + "</td>" +
													"</tr>";
									$('#assignmentTable').append(records);
								}
							});
						});
					}
				});
			});
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
