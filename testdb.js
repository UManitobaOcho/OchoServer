exports.getStudent = function(socket) {
    socket.emit('foundStudent', {username: 'Nico'});
};

exports.getProf = function(socket) {
    socket.emit('foundProf', {username: 'Zapp'});
};

exports.getCourses = function(socket) {
    courses =  {
        course_name: 'Operating Systems 1',
        course_number: '3430',
        course_section: 'A01',
        name: 'Zapp',
        class_times: 'MWF: 10:30am'
    }        
    socket.emit('foundCourses', courses);
    return courses;
};

exports.getProfCourses = function(socket,data) {
    socket.emit('foundProfCourses', {name: '4350 Software Engineering 2'});
};

