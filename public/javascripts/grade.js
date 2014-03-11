//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);


window.onload = function () { 
	getEnrolledInfo("1");
};

function getEnrolledInfo(studentID) {
	socket.emit('getEnrolledInfo', {student_id: studentID});
	socket.on('returnEnrolledInfo', function(enrolled) {
		displayEnrolledInfo(enrolled);
	});
};

function displayEnrolledInfo(enrolled) {
	// currently only demos
	// getCourseInfo can't be called, since other function use it

	
	//socket.emit("setSessionVariable", {varName: 'courseId', varValue: enrolled.course_id});
	//socket.emit('getCourseInfo');
	//socket.on('returnCourseInfo', function(courseInfo) {
		var tableElements = "	<tr>" +
							"		<td>" + "COMP 4350" + "</td>" +
							"		<td>" + "A01" + "</td>" +
							"		<td>3</td>" + 
							"		<td>A</td>";
		
		$('#grade_table tbody').append(tableElements);
	//});
};

