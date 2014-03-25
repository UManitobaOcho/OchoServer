//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);

var isProf = false;

window.onload = function () {
	console.log("entered on assignmens.js"); 
	socket.emit('getUserType');
	socket.on('returnUserType', function(data) {
		if (data.userType === 1) {
			isProf = true;
		}

		getAssignmentsForCourse('1');
	});
};

function getAssignmentsForCourse(CourseID) {
	socket.emit('getAssignmentsForCourse', {course_id: CourseID});
	socket.on('foundAssignments', function(assignments) {
		displayAssignments(assignments);
	});
};

function displayAssignments(assignment) {


	console.log("displayAssignments has called.");
	
	btnGroupTag = "<div class='btn-group'>";
	_btnGroupTag = "</div>";
	// homeBtn = "<button id='homeBtn' type='button' class='btn btn-default btn-lg'> <span title='Course Home' class='glyphicon glyphicon-home' /> </button>";
	//editBtn = "<button id='editBtn' type='button' class='btn btn-default btn-lg'> <span title='Edit' class='glyphicon glyphicon-pencil' /> </button>";
	downloadBtn = "<button id='downloadBtn' type='button' class='btn btn-default btn-lg'> <span title='Download' class='glyphicon glyphicon-download' /> </button>";
	submitBtn = "<button id='submitBtn' type='button' class='btn btn-default btn-lg'> <span title='Submit' class='glyphicon glyphicon-inbox' /> </button>";

	if(isProf){
		submitBtn = "<button id='markBtn' type='button' class='btn btn-default btn-lg markBtn'> <span title='Mark Assignments' class='glyphicon glyphicon-inbox' /> </button>";
	}

	btnGroup = btnGroupTag + downloadBtn + submitBtn + _btnGroupTag;

	for (var i = 0; i < assignment.length; i++) {
		var show = true;
		var tableElements = "";
		if(!isProf && !isPastDate(assignment[i].viewable_date))
			show = false;		

		if(show){
					tableElements = "		<tr>" +
						 	"		<td>" + assignment[i].course_number + "</td>" +
						 	"		<td id='assignmentUID'>" + assignment[i].assignment_id + "</td>" +
							"		<td>" + assignment[i].assignment_name + "</td>" +
						 	"		<td>" + assignment[i].viewable_date + "</td>" +
						 	"		<td>" + assignment[i].due_date + "</td>" +
						 	"		<td>" + btnGroup + "</td>";
		}

		/* Can I conver percentage grade into letter grade?
		 * parseInt(enrolled.grade,10) >= 90) gives me an error
		 */
		$('#assignment_table tbody').append(tableElements);
	}
	addTableBtnFuncs();
};

function isPastDate(date){
	var split = date.split();
	var d = Date.parse(split[0]);
	return ((new Date) - d) > 0;
}

function addTableBtnFuncs() {
	$('td #downloadBtn').click(function () {
		// Download the assignment
		downloadAssignment( $(this).parent().parent().parent() );
	});
		// Go to the submitAnswer HomePage
	if(isProf){
		$('.markBtn').on("click", function () { 
			gotoMark( $(this).parent().parent().parent() ); 
		});
	} else {
		$('td #submitBtn').click(function () { 
			submitAnswer( $(this).parent().parent().parent() ); 
		});
	}
};

function downloadAssignment(tr) {
	var assignmentId = tr.children("#assignmentUID").text();
	socket.emit("setSessionVariable", {varName: 'assignmentId', varValue: assignmentId});
	//document.location.href = "/Course";
};

function gotoMark(tr){	
	var assignmentId = tr.children("#assignmentUID").text();
	socket.emit("setSessionVariable", {varName: 'assignmentId', varValue: assignmentId});
	document.location.href = "/MarkAssignments";
}

function submitAnswer(tr) {
	var assignmentId = tr.children("#assignmentUID").text();
	socket.emit("setSessionVariable", {varName: 'assignmentId', varValue: assignmentId});

	document.location.href = "/SubmitAssignmentAnswer";
};
