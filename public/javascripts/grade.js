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
	console.log(enrolled.length);

	socket.emit("setSessionVariable", {varName: 'courseId', varValue: enrolled[0].course_id});
	socket.emit('getCourseInfo');
	socket.on('returnCourseInfo', function(courseInfo) {
		var tableElements = "	<tr>" +
						 	" 		 <td>" + courseInfo.course_number + "</td>" +
						 	"		 <td>" + courseInfo.course_name + "</td>" +
							"		 <td>" + courseInfo.course_section + "</td>" +
						 	"		 <td>3</td>" +
						 	"		 <td>" + enrolled[0].grade + "</td>";
		
		/* Can I conver percentage grade into letter grade?
		 * parseInt(enrolled.grade,10) >= 90) gives me an error
		 */
		$('#grade_table tbody').append(tableElements);
	});

	//socket.emit("setSessionVariable", {varName: 'courseId', varValue: enrolled[1].course_id});
	//socket.emit('getCourseInfo');
	//socket.on('returnCourseInfo', function(courseInfo) {
	//	var tableElements = "	<tr>" +
	//					 	" 		 <td>" + courseInfo.course_number + "</td>" +
	//					 	"		 <td>" + courseInfo.course_name + "</td>" +
	//						"		 <td>" + courseInfo.course_section + "</td>" +
	//					 	"		 <td>3</td>" +
	//					 	"		 <td>" + enrolled[1].grade + "</td>";
	//	
	//	/* Can I conver percentage grade into letter grade?
	//	 * parseInt(enrolled.grade,10) >= 90) gives me an error
	//	 */
	//	$('#grade_table tbody').append(tableElements);
	//});

	//for (int i = 0; i < enrolled.length; i++) {
	//	socket.emit("setSessionVariable", {varName: 'courseId', varValue: enrolled[i].course_id});
	//	socket.emit('getCourseInfo');
	//	socket.on('returnCourseInfo', function(courseInfo) {
	//		var tableElements = "	<tr>" +
	//						 	" 		 <td>" + courseInfo.course_number + "</td>" +
	//						 	"		 <td>" + courseInfo.course_name + "</td>" +
	//							"		 <td>" + courseInfo.course_section + "</td>" +
	//						 	"		 <td>3</td>" +
	//						 	"		 <td>" + enrolled[i].grade + "</td>";
	//	
	//		/* Can I conver percentage grade into letter grade?
	//	 	* parseInt(enrolled.grade,10) >= 90) gives me an error
	//	 	*/
	//	 	$('#grade_table tbody').append(tableElements);
	//	});
	//}
	
};

