//Change Textbox Value

window.onload = function() {
	$('.select-student').hide();
	$('.select-button').hide();
	getProfCourses();
	$('.logout').show();
        $('#releaseTime').timepicker();
        $('#dueTime').timepicker();

	$('#releaseDate').datepicker()
		.on('changeDate', function(ev){
			$('#releaseDate').datepicker('hide'); //Autohides date picker after click
		});
	$('.startDate span').click( function() { $('#releaseDate').datepicker('show'); }); //Show calendar on icon click

	$('#dueDate').datepicker()
		.on('changeDate', function(ev){
			$('#dueDate').datepicker('hide'); //Autohides date picker after click
		});
	$('.endDate span').click( function() { $('#dueDate').datepicker('show'); }); //Show calendar on icon click

	$('#submitBtn').click( function() {
		addAssignment()
	});
	$('#selectCourse').click(function() {
		getStudNotInCourse();
	});
	$('#selectStudents').click(function() {
		getStudInCourse();
	});
	$('#addStudent').click( function() {
		addStudentToCourse();
	});
	$('#removeStudent').click( function() {
		removeStudentToCourse();
	});

};

$(function() {
	$('#assignment').change(function(){
		var input,file;
		var maxsize = 20000;
		
		input = document.getElementById('assignment');
		
		if(!input){ 
			document.getElementById("errorbox").innerHTML = "Error Loading File";
		}else{
			file = input.files[0];
			
			if(file.size > maxsize){
				document.getElementById("errorbox").innerHTML = "Error: To Large By " + Math.round((file.size-maxsize)/1024) + " Kilobytes.";
				$('#assignmentbox').val(" ");
				input.files[0] = null;
			}else if((file.type).substring(0, "text/".length) != "text/") {
                                document.getElementById("errorbox").innerHTML = "Only text file uploads supported.";
                                $('#assignmentbox').val(" ");
                                input.files[0] = null;
				console.log(file.type);
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
			option.val = courses.rows[i].course_id;
			selector.add(option);
		}
		
		console.log("Set Prof Courses");
	});
}
function verifyList(e) {
	var result = true;
	if(e.options.length == 0)
	{
		result = false;
	}
	return result;
}

function verifyStudent(stud){
	var result = false;
	if(stud != null)
	{
		if(stud.rows != null)
		{
			if(stud.rows[0] != null)
			{
				return true;
			}
		}

	}
	return result;
}

function getStudNotInCourse(){
	console.log("Getting students not in this course");
	var e = document.getElementById("class-picker");
	var res = verifyList(e);
	if(res)
	{
		var strClass = e.options[e.selectedIndex].val;
		socket.emit('getStudNotInCourse', {course: strClass});
		socket.on('foundStudNotInCourse', function(student) {
			var result = verifyStudent(student);
			if(result)
			{
				var selector = document.getElementById("student-picker");
				selector.innerHTML= "";
				for(var i=0; i<student.rows.length; i++){
					option = document.createElement("option");
					console.log(student.rows[i].username);
					option.text = "Username: " + student.rows[i].username + "  First Name: " + student.rows[i].first_name + "  Last Name: " + student.rows[i].last_name;
					option.val = student.rows[i].student_id;
					selector.add(option);
				}

				$('.select-student').show();
				$('.select-button').show();
			}
		});
	}
}

function getStudInCourse(){
	console.log("Getting students in this course");
	var e = document.getElementById("class-picker");
	var res = verifyList(e);
	if(res)
	{
		var strClass = e.options[e.selectedIndex].val;
		socket.emit('getStudInCourse', {course: strClass});
		socket.on('foundStudInCourse', function(student) {
			result = verifyStudent(student);
			if(result) {
				var selector = document.getElementById("student-picker");
				selector.innerHTML= "";
				for(var i=0; i<student.rows.length; i++){
					option = document.createElement("option");
					console.log(student.rows[i].username);
					option.text = "Username: " + student.rows[i].username + "  First Name: " + student.rows[i].first_name + "  Last Name: " + student.rows[i].last_name;
					option.val = student.rows[i].student_id;
					selector.add(option);
				}
				$('.select-student').show();
				$('.select-button').show();
			}
		});
	}
}

function addStudentToCourse() {
	console.log("Add student");
	var strStud = "";
	var students = document.getElementById("student-picker");
	var e = document.getElementById("class-picker");
	var strClass = e.options[e.selectedIndex].val;

	//place if statement if -1 then don't go to server, do something else
	for(var i = 0;i < students.options.length; i++)
	{
		if(students[i].selected)
		{
			strStud = strStud + students[i].val + ",";
		}
	}

	socket.emit('addStudentToCourse', {student: strStud, course: strClass});
	socket.on('addedStudent', function (student) {
		console.log("Student Added Successfully");
		document.location.href = "/";

	});
}

function removeStudentToCourse() {
	console.log("Remove student");
	var strStud = "";
	var students = document.getElementById("student-picker");
	var e = document.getElementById("class-picker");
	var strClass = e.options[e.selectedIndex].val;

	for(var i = 0;i < students.options.length; i++)
	{
		if(students[i].selected)
		{
			strStud = strStud + students[i].val + ",";
		}
	}
	socket.emit('removeStudentToCourse', {student: strStud, course: strClass});
	socket.on('removedStudent', function (student) {
		console.log("Student Removed Successfully");
		document.location.href = "/";

	});
}


function addAssignment(){
	console.log("Verifing Assignment");

	var e = document.getElementById("class-picker");
	var strClass = e.options[e.selectedIndex].text;
	var assignTitle = $('#assignment-title').val();
	var releaseDate = $('#releaseDate').val() + ' ';
	var dueDate = $('#dueDate').val() + ' ';
	var releaseTime = $('#releaseTime').val();
	var dueTime = $('#dueTime').val();

	// To make formating consistent
	if(($('#releaseTime').val().split(":"))[0].length < 2) {
		releaseTime = '0' + $('#releaseTime').val();
	}
	if(($('#dueTime').val().split(":"))[0].length < 2) {
		dueTime = '0' + $('#dueTime').val();
	}

	releaseDate = releaseDate + releaseTime
	dueDate = dueDate + dueTime;
	
	var verified = verifyAssignmentFields();

	if(verified == 1) {
		var input,file;
		var fread = new FileReader();
		var contents;
		var name;
		var type;
		var size;
		
		input = document.getElementById('assignment');

		if(!input){
			document.getElementById("errorbox").innerHTML = "Error Loading File";
        	} else {
            		file = input.files[0];
			name = file.name;
			type = file.type;
			size = file.size;

			fread.onload = function(e) {
				contents = e.target.result;
			
				console.log("File:" + contents);
				console.log("Submitting Assignment");
				socket.emit('profAddAssignment', {assignmentTitle: assignTitle, course: strClass, name: name, type: type, size: size, file: contents, releaseDate: releaseDate, dueDate: dueDate})
	        		socket.on('ProfAssignmentSubmitted', function(courses) {
	    				console.log("Assignment Submitted Successfully");
					document.location.href = "/";
    				});
			}
			fread.readAsText(file);
		}
	} else {
		console.log("Assignment fields failed verification");
	}
}

function verifyAssignmentFields(){
	var assignmentboxlen = $('#assignmentbox')[0].value.length;
	var returnVal = 1;
	var d = new Date();
	var dueDate = ($('#dueDate').val().split('/'));
	var releaseDate = ($('#releaseDate').val().split('/'));
	var regex = /^\d{1,}:\d{2} \s?(AM|PM|am|pm)?$/m;

	// clear errors
	$('#assignment-title--error').html(' ');
	$('#endTime-error').html(' ');
	$('#startTime-error').html(' ');
	$('#errorbox').html(' ');

	if(!regex.test($('#releaseTime').val())) {
        $('#startTime-error').html('*Not a Valid Time');
        returnVal = 0;
    }

    if(!regex.test($('#dueTime').val())) {
        $('#endTime-error').html('*Not a Valid Time');
        returnVal = 0;
    }
	
	if($('#assignment-title')[0].value.length <= 1) {
		$("#assignment-title-error").html('*Name is to Short');
		returnVal = 0;
	}

	if(assignmentboxlen < 1) {
		$("#errorbox").html('*No File Selected');
		returnVal = 0;
	}
	
	if(!(/[0-1][0-9]\/[0-3][0-9]\/[2-3][0-9][0-9][0-9]/.test($('#releaseDate')[0].value))) {
		$('#startTime-error').html('*Release Date is not valid');
		returnVal = 0;
	}

    if(!(/[0-1][0-9]\/[0-3][0-9]\/[2-3][0-9][0-9][0-9]/.test($('#dueDate')[0].value))) {
        $('#endTime-error').html('*Due Date is not valid');
        returnVal = 0;
    }

	if(parseInt(dueDate[2]) < parseInt(releaseDate[2])) {
		$('#endTime-error').html('*Due date must be after the release date');
		returnVal = 0;
	} else if(parseInt(dueDate[2]) == parseInt(releaseDate[2])) {
		if(parseInt(dueDate[0]) < parseInt(releaseDate[0])) {
			$('#endTime-error').html('*Due date must be after the release date');
        	returnVal = 0;
		}else if(parseInt(dueDate[0]) == parseInt(releaseDate[0])) {
			if(parseInt(dueDate[1]) < parseInt(releaseDate[1])) {
				$('#endTime-error').html('*Due date must be after the release date');
        		returnVal = 0;
			}
		} 
	}

    if(parseInt(dueDate[2]) < d.getFullYear()) {
        $('#endTime-error').html('*Due date must be after todays date');
        returnVal = 0;
    }else if(parseInt(dueDate[2]) == d.getFullYear()) {
        if(parseInt(dueDate[0]) < (d.getMonth()+1)) {
            $('#endTime-error').html('*Due date must be after todays date');
            returnVal = 0;
        }else if(parseInt(dueDate[0]) == (d.getMonth()+1)) {
            if(parseInt(dueDate[1]) < d.getDate()) {
                $('#endTime-error').html('*Due date must be after todays date');
                returnVal = 0;
            }
        }
    }

    if(parseInt(releaseDate[2]) < d.getFullYear()) {
        $('#startTime-error').html('*Release date must be after the todays date');
        returnVal = 0;
    }else if(parseInt(releaseDate[2]) == d.getFullYear()) {
        if(parseInt(releaseDate[0]) < (d.getMonth()+1)) {
            $('#startTime-error').html('*Release date must be after todays date');
            returnVal = 0;
        }else if(parseInt(releaseDate[0]) == (d.getMonth()+1)) {
            if(parseInt(releaseDate[1]) < d.getDate()) {
                $('#startTime-error').html('*Release date must be after todays date');
                returnVal = 0;
            }
        }
    }

	return returnVal;
}
