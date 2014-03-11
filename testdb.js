    var courses =  {rowCount: 2,
				rows: [{
        			course_name: 'Operating Systems 1',
        			course_number: '3430',
        			course_section: 'A01',
        			name: 'J.Young',
        			class_times: 'MWF: 10:30am'
    					}, 
					{ 
        			course_name: 'Software Engineering 2',
        			course_number: '4350',
        			course_section: 'A01',
        			name: 'M.Zapp',
        			class_times: 'TR: 11:30am'
					}
					]};

exports.getStudent = function(socket, res) {
	var r = {username: 'Nico'};
	res(r);
};

exports.getProf = function(socket, data, res) {
	var r = {username: 'Zapp'};
	res(r);
};

exports.getCourses = function(socket, res) {
	res(courses);
};

exports.addCourse = function(socket, course, session, res){	
	var id = course.userId ? course.userId : session.userId;
	var newCourse = {
        			course_name: course.courseName,
        			course_number: course.courseNum,
        			course_section: course.section,
        			name: id,
        			class_times: course.times };
	courses.rowCount++;
	courses.rows.push(newCourse);	
};

exports.getProfCourses = function(socket,data,res) {
	var r = {name: '4350 Software Engineering 2'};
	res(r);
};

