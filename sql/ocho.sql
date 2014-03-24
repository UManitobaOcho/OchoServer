/**
*	Create sequences
*/
create sequence SETTINGS_SEQ;
create sequence COURSE_SEQ;
create sequence STUDENT_SEQ;
create sequence PROF_SEQ;
create sequence ENROLLED_SEQ;
create sequence FORUM_SEQ;
create sequence TOPIC_SEQ;
create sequence NOTES_SEQ;
create sequence ASSIGNMENT_SEQ;
create sequence TEST_SEQ;


/**
*	Create tables
*/
create table SAVED_SETTINGS(
	settings_id BIGINT UNIQUE primary key,
	is_prof 	BOOLEAN
);

create table STUDENTS(
	student_id 	BIGINT UNIQUE primary key,
	username 	VARCHAR(25) NOT NULL,
	first_name	VARCHAR(25) NOT NULL,
	last_name 	VARCHAR(25) NOT NULL,
	email 		VARCHAR(50) NOT NULL,
	password 	VARCHAR(50) NOT NULL,
	settings_id	BIGINT references SAVED_SETTINGS(settings_id)
);

create table PROFESSORS(
	prof_id BIGINT 	UNIQUE primary key,
	username		VARCHAR(25) NOT NULL,
	name 			VARCHAR(50) NOT NULL,
	email 			VARCHAR(50) NOT NULL,
	password 		VARCHAR(50) NOT NULL,
	office_hours	VARCHAR(500) NOT NULL,
	settings_id 	BIGINT references SAVED_SETTINGS(settings_id),
	is_TA 			BOOLEAN
);

create table COURSES(
	course_id 		BIGINT UNIQUE primary key,
	course_number 	VARCHAR(10) NOT NULL,
	course_section 	VARCHAR(3) NOT NULL,
	course_name 	VARCHAR(50) NOT NULL,
	prof_id 		BIGINT references PROFESSORS(prof_id),
	class_times 	VARCHAR(200)
);

create table ENROLLED(
	enrolled_id BIGINT UNIQUE primary key,
	student_id 	BIGINT references STUDENTS(student_id),
	course_id 	BIGINT references COURSES(course_id),
	grade 		NUMERIC(3)
);

create table FORUM(
	forum_id 	BIGINT UNIQUE primary key,
	course_id 	BIGINT references COURSES(course_id)
);

create table FORUM_TOPIC(
	topic_id 	BIGINT UNIQUE primary key,
	forum_id 	BIGINT references FORUM(forum_id),
	topic_name 	VARCHAR(200),
	post_date 	DATE NOT NULL
);

create table FORUM_POSTS(
	topic_id 		BIGINT references FORUM_TOPIC(topic_id),
	student_id 		BIGINT references STUDENTS(student_id),
	prof_id 		BIGINT references PROFESSORS(prof_id),
	post_content	VARCHAR(2000)
);

create table COURSE_EVENT(
	course_id 		BIGINT references COURSES(course_id),
	event_name 		VARCHAR(100) NOT NULL,
	event_desc 		VARCHAR(500) NOT NULL,
	event_time 		DATE NOT NULL,
	event_duration 	DATE NOT NULL
);

create table COURSE_NEWS(
	course_id 		BIGINT references COURSES(course_id),
	news_title 		VARCHAR(200) NOT NULL,
	news_content	VARCHAR(1000) NOT NULL
);

create table COURSE_NOTES(
	notes_id 		BIGINT UNIQUE primary key,
	course_id 		BIGINT references COURSES(course_id),
	upload_date 	DATE NOT NULL,
	lecture_number	NUMERIC(2) NOT NULL,
	viewable_date 	DATE NOT NULL
);

create table ASSIGNMENTS(
	assignment_id 	BIGINT UNIQUE primary key,
	course_id 		BIGINT references COURSES(course_id),
	due_date 		VARCHAR(30) NOT NULL,
	viewable_date 	VARCHAR(30) NOT NULL,
	assignment_name	VARCHAR(200) NOT NULL,
	file_name	VARCHAR(200),
	file_type	VARCHAR(200),
	file_size	VARCHAR(200),
	assignment_file	TEXT
);

create table SUBMITTED_ASSIGNMENTS(
	enrolled_id 	BIGINT references ENROLLED(enrolled_id),
	assignment_id 	BIGINT references ASSIGNMENTS(assignment_id),
	submission_time DATE NOT NULL,
	comments		VARCHAR(1000),
	grade 			NUMERIC(3) NOT NULL,
	assignment_file BYTEA
);

create table TESTS(
	test_id 		BIGINT UNIQUE primary key,
	course_id 		BIGINT references COURSES(course_id),
	viewable_date 	DATE NOT NULL,
	test_time 		DATE NOT NULL,
	time_limit 		NUMERIC(3) NOT NULL
);

create table COMPLETED_TESTS(
	enrolled_id BIGINT references ENROLLED(enrolled_id),
	test_id 	BIGINT references TESTS(test_id),
	grade 		NUMERIC(3) NOT NULL
);


/**
*	Insert initial data
*/
insert into SAVED_SETTINGS values(
	nextval('SETTINGS_SEQ'),
	FALSE
);

insert into SAVED_SETTINGS values(
	nextval('SETTINGS_SEQ'),
	TRUE
);

insert into STUDENTS values(
	nextval('STUDENT_SEQ'),
	'umplishk',
	'Alexander',
	'Plishka',
	'umplishk@myumanitoba.ca',
	'password',
	1
),
(
	nextval('STUDENT_SEQ'),
	'umbhumbe',
	'Jasdeep',
	'Bhumber',
	'umbhumbe@myumanitoba.ca',
	'password',
	1
),
(
	nextval('STUDENT_SEQ'),
	'umbluresf',
	'Blurender',
	'sfrenickoistic',
	'umbluresf@myumanitoba.ca',
	'password',
	1
);

insert into PROFESSORS values(
	nextval('PROF_SEQ'),
	'cszapp',
	'Michael Zapp',
	'zapp@cs.umanitoba.ca',
	'password',
	'None',
	2,
	FALSE
);

insert into COURSES values(
	nextval('COURSE_SEQ'),
	'COMP 4350',
	'A01',
	'Software Engineering 2',
	1,
	'TR 11:30 AM - 12:45 PM'
);

insert into ENROLLED values(
	nextval('ENROLLED_SEQ'),
	1,
	1,
	80
);

/**
*	Create Stored Procedures
*/
CREATE OR REPLACE FUNCTION addEnrolled(studentid BIGINT, courseid BIGINT )
        RETURNS integer AS $val$
begin
        insert into Enrolled values(
                nextval('ASSIGNMENT_SEQ'),
                studentid,
                courseid
        );
        return 0;
end;
$val$ language plpgsql;

CREATE OR REPLACE FUNCTION addAssignment(courseid BIGINT, duedate VARCHAR, viewabledate VARCHAR, assignmentname VARCHAR, name VARCHAR, type VARCHAR, size VARCHAR, assignmentfile TEXT)
        RETURNS integer AS $val$
begin
        insert into ASSIGNMENTS values(
                nextval('ASSIGNMENT_SEQ'),
                courseid,
                duedate,
                viewabledate,
                assignmentname,
		name,
		type,
		size,
                assignmentfile
        );
        return 0;
end;
$val$ language plpgsql;

CREATE OR REPLACE FUNCTION addCourse(cNum VARCHAR, sect VARCHAR, cName VARCHAR, pId BIGINT, cTimes VARCHAR)
	RETURNS integer AS $val$
declare
	val BIGINT;
begin
	val = nextval('COURSE_SEQ');
	insert into COURSES values(
		val,
		cNum,
		sect,
		cName,
		pId,
		cTimes
	);
	return val;
end;
$val$ language plpgsql;

CREATE OR REPLACE FUNCTION answerAssignment(cId VARCHAR, sect VARCHAR, cName VARCHAR, pId BIGINT, cTimes VARCHAR)
	RETURNS integer AS $val$
declare
	val BIGINT;
begin
	val = nextval('COURSE_SEQ');
	insert into COURSES values(
		val,
		cNum,
		sect,
		cName,
		pId,
		cTimes
	);
	return val;
end;
$val$ language plpgsql;

CREATE OR REPLACE FUNCTION updateCourse(cId BIGINT, cNum VARCHAR, sect VARCHAR, cName VARCHAR, cTimes VARCHAR)
	RETURNS BOOLEAN as $updated$
begin
	update COURSES
	set course_number = cNum,
		course_section = sect,
		course_name = cName,
		class_times = cTimes
	where course_id = cId;
	return true;
end;
$updated$ language plpgsql;

CREATE OR REPLACE FUNCTION deleteCourse(cId BIGINT)
	RETURNS BOOLEAN as $deleted$
begin
	delete from COURSES where course_id = cId;
	return true;
end;
$deleted$ language plpgsql;


CREATE OR REPLACE FUNCTION deleteCompleteTest(eId BIGINT)
	RETURNS BOOLEAN as $deleted$
begin
	delete from completed_tests where enrolled_id = eId;
	return true;
end;
$deleted$ language plpgsql;

CREATE OR REPLACE FUNCTION deletesumbittedAssignment(eId BIGINT)
	RETURNS BOOLEAN as $deleted$
begin
	delete from submitted_assignments where enrolled_id = eId;
	return true;
end;
$deleted$ language plpgsql;

CREATE OR REPLACE FUNCTION deleteAssignment(aId BIGINT)
        RETURNS BOOLEAN as $deleted$
begin
        delete from assignments where assignment_id = aId;
        return true;
end;
$deleted$ language plpgsql;

CREATE OR REPLACE FUNCTION deleteEnrolled(eId BIGINT)
	RETURNS BOOLEAN as $deleted$
begin
	delete from enrolled where enrolled_id = eId;
	return true;
end;
$deleted$ language plpgsql;


/***************************** Test Only!!!!!!! *****************************/
/* Only for Grade Display purpose......Do not include this in your database */
/* for other usage......Also, modify the id (SUBMITTED_ASSIGNMENTS &        */
/* COMPLETED_TEST) accordingly.											    */
/****************************************************************************/
/*
insert into ASSIGNMENTS values(
	nextval('ASSIGNMENT_SEQ'),
	1,
	current_date,
	current_date,
	'Assignment 1',
	(E'\\320\\170'::bytea)
);

insert into ASSIGNMENTS values(
	nextval('ASSIGNMENT_SEQ'),
	1,
	current_date,
	current_date,
	'Assignment 2',
	(E'\\320\\170'::bytea)
);

insert into ASSIGNMENTS values(
	nextval('ASSIGNMENT_SEQ'),
	1,
	current_date,
	current_date,
	'Assignment 3',
	(E'\\320\\170'::bytea)
);

insert into SUBMITTED_ASSIGNMENTS values(
	1,
	9,
	current_date,
	80
);

insert into SUBMITTED_ASSIGNMENTS values(
	1,
	10,
	current_date,
	65
);

insert into SUBMITTED_ASSIGNMENTS values(
	1,
	11,
	current_date,
	73
);

insert into TESTS values(
	nextval('TEST_SEQ'),
	1,
	current_date,
	current_date,
	60
);


insert into TESTS values(
	nextval('TEST_SEQ'),
	1,
	current_date,
	current_date,
	60
);


insert into TESTS values(
	nextval('TEST_SEQ'),
	1,
	current_date,
	current_date,
	60
);

insert into COMPLETED_TESTS values(
	1,
	4,
	100
);

insert into COMPLETED_TESTS values(
	1,
	5,
	50
);

insert into COMPLETED_TESTS values(
	1,
	6,
	60
);
*/
/***************************** Test Only!!!!!!! *****************************/
