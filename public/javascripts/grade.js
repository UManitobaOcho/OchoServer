var hostUrl = "http://localhost:8080";
//var hostUrl = window.location.host;
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
	
	for (var i = 0; i < enrolled.length; i++) {
		var tableElements = "	<tr>" +
						 	"		<td>" + enrolled[i].course_number + "</td>" +
						 	"		<td>" + enrolled[i].course_name + "</td>" +
							"		<td>" + enrolled[i].course_section + "</td>" +
						 	"		<td>3</td>" +
						 	"		<td>" + enrolled[i].grade + "</td>";
		
		/* Can I conver percentage grade into letter grade?
		 * parseInt(enrolled.grade,10) >= 90) gives me an error
		 */
		$('#grade_table tbody').append(tableElements);
	}

};

