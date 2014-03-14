//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);


window.onload = function () {
	console.log("entered on assignmens.js"); 
	getAssignmentsForCourse("1");
};

function getAssignmentsForCourse(CourseID) {
	socket.emit('getAssignmentsForCourse', {courseID: CourseID});
	socket.on('foundAssignments', function(assignments) {
		displayAssignments(assignments);
	});
};

function displayAssignments(assignment) {
	console.log("displayAssignments has called.")
	for (var i = 0; i < assignment.length; i++) {
		var tableElements = "	<tr>" +
						 	"		<td>" + assignment[i].course_id + "</td>" +
						 	"		<td>" + assignment[i].assignment_id + "</td>" +
							"		<td>" + assignment[i].assignment_name + "</td>" +
						 	"		<td>" + assignment[i].viewable_date + "</td>" +
						 	"		<td>" + assignment[i].due_date + "</td>";
		
		/* Can I conver percentage grade into letter grade?
		 * parseInt(enrolled.grade,10) >= 90) gives me an error
		 */
		$('#assignment_table tbody').append(tableElements);
	}
};