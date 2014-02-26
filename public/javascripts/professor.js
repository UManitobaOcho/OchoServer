//Change Textbox Value

window.onload = function() {
	getProfCourses();
	$('.logout').show();
        $('#releaseDate').datepicker();
        $('#dueDate').datepicker();
	$('#submitBtn').click( function() {
		addAssignment()
	});
	$('#selectCourse').click(function() {
		getStudNotInCourse();
	});

};

$(function() {
	$('#assignment').change(function(){
		var input,file;
		var maxsize = 1000;
		
		input = document.getElementById('assignment');
		
		if(!input){ 
			document.getElementById("errorbox").innerHTML = "Error Loading File";
		}else{
			file = input.files[0];
			
			if(file.size > maxsize){
				document.getElementById("errorbox").innerHTML = "Error: To Large By " + Math.round((file.size-maxsize)/1024) + " Kilobytes.";
				$('#assignmentbox').val(" ");
				input.files[0] = null;
			}else{
				document.getElementById("errorbox").innerHTML = "";
				$('#assignmentbox').val(file.name);
			}
		}
	});

	$('#browse-btn').click(function(){
		$('#assignment').click();
	});
});

function getProfCourses(){
	console.log("Getting Prof Courses");
	socket.emit('getProfCourses', {username: 'cszapp'});
	socket.on('foundProfCourses', function(courses){
		var selector = document.getElementById("class-picker");
		var option;

		for(var i=0; i<courses.rows.length; i++){
			option = document.createElement("option");
			console.log(courses.rows[i].course_number);
			option.text = courses.rows[i].course_number;
			selector.add(option);
		}
		
		console.log("Set Prof Courses");
	});
}

function getStudNotInCourse(){
	console.log("Getting students not in this course");
	var e = document.getElementById("class-picker");
	var strClass = e.options[e.selectedIndex].text;
	socket.emit('getStudNotInCourse', {course: strClass});
	socket.on('foundStudNotInCourse', function(student) {
		
		var selector = document.getElementById("student-picker");
		selector.innerHTML= "";
		for(var i=0; i<student.rows.length; i++){
			option = document.createElement("option");
			console.log(student.rows[i].username);
			option.text = "Username: " + student.rows[i].username + "  First Name: " + student.rows[i].first_name + "  Last Name: " + student.rows[i].last_name;
			selector.add(option);
		}
	});
}

function addAssignment(){
	console.log("Verifing Assignment");

	var verified = verifyAssignmentFields();
	
	var e = document.getElementById("class-picker");
	var strClass = e.options[e.selectedIndex].text;
	var assignTitle = $('#assignment-title').val()
	var releaseDate = $('#releaseDate').val();
	var dueDate = $('#dueDate').val();

	if(verified == 1) {
		var input,file;
                input = document.getElementById('assignment');

		if(!input){
                        document.getElementById("errorbox").innerHTML = "Error Loading File";
                }else{
                        file = input.files[0];
			
			console.log("Submitting Assignment");
			socket.emit('profAddAssignment', {assignmentTitle: assignTitle, course: strClass, file: file, releaseDate: releaseDate, dueDate: dueDate})
		        socket.on('AssignmentSubmitted', function(courses){
                		console.log("Assignment Submitted Successfully");
				alert('Submitted Successfully!');
				document.location.href = "/";
        		});
		}
	} else {
		console.log("Assignment fields failed verification");
	}
}

function verifyAssignmentFields(){
	var assignmentboxlen = $('#assignmentbox')[0].value.length;
	var returnVal = 1;
	
	if($('#assignment-title')[0].value.length <= 1) {
		document.getElementById("assignment-title-error").innerHTML = "*Name To Short";
		returnVal = 0;
	}
	if(assignmentboxlen <= 3) {
		document.getElementById("errorbox").innerHTML = "*Name To Short";
		returnVal = 0;
	}
	
	return returnVal;
}
