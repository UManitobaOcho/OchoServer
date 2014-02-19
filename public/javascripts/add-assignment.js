//Change Textbox Value

window.onload = function(){
	getProfCourses();
	$('.logout').show();
};

$(document).ready(function () {
	//$('#datetimepicker1').datetimepicker();
});

$('.datepicker').datepicker();

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
		var option = document.createElement("option");

		for(var i=0; i<courses.rows.length; i++){
			console.log(courses.rows[i].course_number);
			option.text = courses.rows[i].course_number;
			selector.add(option);
		}
		
		console.log("Set Prof Courses");
	});
}
