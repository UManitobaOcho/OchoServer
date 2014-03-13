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
		// passed in enrolledID by now, need to change it dynamically
		loadGradesDetails("1");
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
	
	socket.emit('getAssignmentsForCourse', {courseId: course.course_id});
	socket.on('foundAssignments', function(data) {
	
		//for each assignment convert it into a calendar event
		for(var i = 0; i < data.length; i++) {
			var dueDate = new Date(data[0].due_date);
			dueDate.setFullYear(2014);
			dueDate = dueDate.getTime();
			events.push({
				"id": data[0].assignment_id,
				"title": data[0].assignment_name + " is due",
				"url": "http://example.com",
				"class": "event-important",
				"start": dueDate, // Milliseconds
				"end": dueDate // Milliseconds
			});
		}
		
		var calendar = $('#calendar').calendar({ modal: "#events-modal", events_source: events});
	});	
}

function loadGradesDetails(enrolledID) {

	socket.emit('getSubmittedAssignment', enrolledID);
	socket.on('foundSubmittedAssignment', function(data) {
		var assignmentLabel = [];
		var assignmentGrade = [];

		for (var i = 0; i < data.length; i++) {
			assignmentLabel.push(data[i].assignment_name);
			assignmentGrade.push(data[i].grade);
		}

		var data = {
			labels : assignmentLabel,
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,200,1)",
					data : assignmentGrade
				}
			]
		}

		var assignmentChart = new Chart($("#assignmentChart").get(0).getContext("2d")).Bar(data);
	});

	socket.emit('getCompletedTests', enrolledID);
	socket.on('foundCompletedTests', function(data) {

		var table = "<table>" + 
					"<tr>" +
					"	<th>Test Name</th>" + 
					"	<th>Test Score</th>" +
					"</tr>";

		for (var i = 0; i < data.length; i++) {
			table += "<tr>" +
					"	<th>Test " + data[i].test_id + "</th>" + 
					"	<th>" + data[i].grade + "</th>" +
					"</tr>";
		}

		table += "</table>";

		$("#grades").append(table);


		/* Failed to update the 2nd bar chart */
		/* Add <canvas id="testChart" width="400" height="400"></canvas> after another canvas in courseHomepage.jade to fix this problem */
		/*
		var testLabel = [];
		var testGrade = [];

		for (var i = 0; i < data.length; i++) {
			testLabel.push("Test " + data[i].test_id);
			testGrade.push(data[i].grade);
		}

		var testData = {
			labels : testLabel,
			datasets : [
				{
					fillColor : "rgba(220,220,220,0.5)",
					strokeColor : "rgba(220,220,220,1)",
					data : testGrade
				}
			]
		}

		new Chart($("#testChart").get(0).getContext("2d")).Line(testData);
		*/
	});
}

function loadHome(){
	$('.calendar-header').removeClass('displayNone');
	$('#calendar').removeClass('displayNone');
	$('.grades-header').addClass('displayNone');
	$('#grades').addClass('displayNone');

	$('.content').html('<p> HOME PAGE ! </p>');
}

function loadGrades(){
	$('.calendar-header').addClass('displayNone');
	$('#calendar').addClass('displayNone');
	$('.grades-header').removeClass('displayNone');
	$('#grades').removeClass('displayNone');

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
