//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);


window.onload = function () {
	console.log("entered on assignmens.js"); 
	getAssignmentsForCourse('1');
};

function getAssignmentsForCourse(CourseID) {
	socket.emit('getAssignmentsForCourse', {course_id: CourseID});
	socket.on('foundAssignments', function(assignments) {
		displayAssignments(assignments);
	});
};

function displayAssignments(assignment) {
	console.log("displayAssignments has called.")
	
	btnGroupTag = "<div class='btn-group'>";
	_btnGroupTag = "</div>";
	// homeBtn = "<button id='homeBtn' type='button' class='btn btn-default btn-lg'> <span title='Course Home' class='glyphicon glyphicon-home' /> </button>";
	//editBtn = "<button id='editBtn' type='button' class='btn btn-default btn-lg'> <span title='Edit' class='glyphicon glyphicon-pencil' /> </button>";
	downloadBtn = "<button id='downloadBtn' type='button' class='btn btn-default btn-lg'> <span title='Downlad' class='glyphicon glyphicon-download' /> </button>";
	submitBtn = "<button id='submitBtn' type='button' class='btn btn-default btn-lg'> <span title='Submit' class='glyphicon glyphicon-inbox' /> </button>";

	btnGroup = btnGroupTag + downloadBtn + submitBtn + _btnGroupTag;

	for (var i = 0; i < assignment.length; i++) {
		var tableElements = "		<tr>" +
						 	"		<td>" + assignment[i].course_number + "</td>" +
						 	"		<td>" + assignment[i].rank + "</td>" +
							"		<td>" + assignment[i].assignment_name + "</td>" +
						 	"		<td>" + assignment[i].viewable_date + "</td>" +
						 	"		<td>" + assignment[i].due_date + "</td>" +
						 	"		<td>" + btnGroup + "</td>";

		/* Can I conver percentage grade into letter grade?
		 * parseInt(enrolled.grade,10) >= 90) gives me an error
		 */
		$('#assignment_table tbody').append(tableElements);
	}
};

function addTableBtnFuncs() {
	$('td #downloadBtn').click(function () {
		// Go to Course HomePage
		downloadAssignment( $(this).parent().parent().parent() );
	});
	$('td #submitBtn').click(function () { 
		submitAnswer( $(this).parent().parent().parent() ); 
	});
};

function downloadAssignment(tr) {
	var assignmentId = $("td.assignment_id", tr).text();
	socket.emit("setSessionVariable", {assignment_id: assignmentId});
	//document.location.href = "/Course";
};

function submitAnswer(tr) {
	var assignmentId = $("td.courseId", tr).text();
	socket.emit("setSessionVariable", {varName: 'courseId', varValue: cId});

	document.location.href = "/Course";
};
