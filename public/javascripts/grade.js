//var hostUrl = "http://localhost:8080";
var hostUrl = window.location.host;
var socket = io.connect(hostUrl);

/*****************************/
/*  Grade Conversion table   */
/*****************************/
/*  A = 5.0                  */
/*  B = 4.0                  */
/*  C = 3.0                  */
/*  D = 2.0                  */
/*  E = 1.0                  */
/*  F = 0.0                  */
/*****************************/

window.onload = function () { 
    // We have only one student, so studentID always be 1
	getEnrolledInfo("1");
};

function getEnrolledInfo(studentID) {
	socket.emit('getEnrolledInfo', {student_id: studentID});
	socket.on('returnEnrolledInfo', function(enrolled) {
		displayEnrolledInfo(enrolled);
	});
};

function displayEnrolledInfo(enrolled) {
	var gradeTotal = 0.0;

    $(".progress").html("");

	for (var i = 0; i < enrolled.length; i++) {
		var tableElements = "	<tr>" +
						 	"		<td>" + enrolled[i].course_number + "</td>" +
						 	"		<td>" + enrolled[i].course_name + "</td>" +
							"		<td>" + enrolled[i].course_section + "</td>" +
						 	"		<td>3</td>" +
						 	"		<td>" + convertNumberToLetterGrade(enrolled[i].grade) + "</td>";
		
        switch(convertNumberToLetterGrade(enrolled[i].grade)) {
            case 'A':
                gradeTotal += 5.0;
                break;
            case 'B':
                gradeTotal += 4.0;
                break;
            case 'C':
                gradeTotal += 3.0;
                break;
            case 'D':
                gradeTotal += 2.0;
                break;
            case 'E':
                gradeTotal += 1.0;
                break;
            case 'F':
                gradeTotal += 0.0;
                break;
            default:
                gradeTotal += 0.0;

        }

		$('#grade_table tbody').append(tableElements);
	}

    var n = (gradeTotal / enrolled.length).toFixed(1);
    var percentage = ((n / 5.0) * 100.0).toFixed(0); 
    var gradeProgress = 
                        "<div class=\"progress-bar\" role=\"progressbar\" aria-valuenow=\"" + n + "\" aria-valuemin=\"0\" aria-valuemax=\"5\" style=\"width:" + percentage + "%;\">" +
                        "" + n + "" +
                        "</div>";
    $(".progress").append(gradeProgress);
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


