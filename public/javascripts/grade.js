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
	
	for (var i = 0; i < enrolled.length; i++) {
		var tableElements = "	<tr>" +
						 	"		<td>" + enrolled[i].course_number + "</td>" +
						 	"		<td>" + enrolled[i].course_name + "</td>" +
							"		<td>" + enrolled[i].course_section + "</td>" +
						 	"		<td>3</td>" +
						 	"		<td>" + convertNumberToLetterGrade(enrolled[i].grade) + "</td>";
		
		$('#grade_table tbody').append(tableElements);
	}

};

function convertNumberToLetterGrade(n){
    var grade = 'F';
    switch(Math.floor(n/10)){
    case 10:
        grade = 'A';
        break;
    case 9: 
        grade = 'A';
        break;
    case 8:
        grade = 'B';
        break;
    case 7:
        grade = 'C';
        break;
    case 6:
        grade = 'D';
        break;
    default:
        grade = 'F';
    }
    return grade;
};


