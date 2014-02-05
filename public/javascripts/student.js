// $(document).ready(function() {
	// $('a#student').click(function() {
		// $.get('http://ec2-54-201-63-66.us-west-2.compute.amazonaws.com:3000/student', {}, function(data){
			// console.log(data);
		// });
	// });
// });

function getStudent() {
	$.get('http://ec2-54-201-63-66.us-west-2.compute.amazonaws.com:3000/student', {}, function(student){
		logIn();
		$('.username').text(student.username);
	});
};

function logIn() {
	$('.jumbotron p').hide();
	$('.user_details').show();
	$('.logout').show();
};

function logout() {
	$('.jumbotron p').show();
	$('.user_details').hide();
	$('.logout').hide();
};