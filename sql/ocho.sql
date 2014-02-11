|-----------------------------------------------------|
| I didn't include all variable with type FILE, and I |
| also changed Tests --- time_limit to NUMERIC(3)     |
|-----------------------------------------------------|

create table SAVED_SETTINGS(
	settings_id BIGINT UNIQUE primary key,
	is_prof BOOLEAN
);

create table STUDENTS(
	student_id BIGINT UNIQUE primary key,
	username VARCHAR(25) NOT NULL,
	last_name VARCHAR(25) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL
);

create table PROFESSORS(
	prof_id BIGINT UNIQUE primary key,
	name VARCHAR(50) NOT NULL,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(50) NOT NULL,
	office_hours VARCHAR(500) NOT NULL,
	settings_id BIGINT references SAVED_SETTINGS(settings_id),
	is_TA BOOLEAN
);

create table COURSE(
	course_id BIGINT UNIQUE primary key,
	course_number VARCHAR(10) NOT NULL,
	course_section VARCHAR(3) NOT NULL,
	course_name VARCHAR(50) NOT NULL,
	prof_id BIGINT references PROFESSORS(prof_id),
	class_times VARCHAR(200)
);

create table ENROLLED(
	enrolled_id BIGINT UNIQUE primary key,
	student_id BIGINT references STUDENTS(student_id),
	course_id BIGINT references COURSE(course_id),
	grade NUMERIC(3)
);

create table FORUM(
	forum_id BIGINT UNIQUE primary key,
	course_id BIGINT references COURSE(course_id)
);

create table FORUM_TOPIC(
	topic_id BIGINT UNIQUE primary key,
	forum_id BIGINT references FORUM(forum_id),
	topic_name VARCHAR(200),
	post_date DATE NOT NULL
);

create table FORUM_POSTS(
	topic_id BIGINT references FORUM_TOPIC(topic_id),
	student_id BIGINT references STUDENTS(student_id),
	prof_id BIGINT references PROFESSORS(prof_id),
	post_VARCHAR VARCHAR(2000)
);

create table COURSE_EVENT(
	course_id BIGINT references COURSE(course_id),
	event_name VARCHAR(100) NOT NULL,
	event_desc VARCHAR(500) NOT NULL,
	event_time DATE NOT NULL,
	event_duration DATE NOT NULL
);

create table COURSE_NEWS(
	course_id BIGINT references COURSE(course_id),
	news_title VARCHAR(200) NOT NULL,
	news_VARCHAR VARCHAR(1000) NOT NULL
);

create table COURSE_NOTES(
	notes_id BIGINT UNIQUE primary key,
	course_id BIGINT references COURSE(course_id),
	upload_date DATE NOT NULL,
	lecture_number NUMERIC(2) NOT NULL,
	viewable_date DATE NOT NULL
);

create table ASSIGNMENT(
	assignment_id BIGINT UNIQUE primary key,
	course_id BIGINT references COURSE(course_id),
	due_date DATE NOT NULL,
	viewable_date DATE NOT NULL
);

create table SUBMITTED_ASSIGNMENT(
	enrolled_id BIGINT references ENROLLED(enrolled_id),
	assignment_id BIGINT references ASSIGNMENT(assignment_id),
	submission_time DATE NOT NULL,
	grade NUMERIC(3) NOT NULL
);

create table TESTS(
	test_id BIGINT UNIQUE primary key,
	course_id BIGINT references COURSE(course_id),
	viewable_date DATE NOT NULL,
	test_time DATE NOT NULL,
	time_limit NUMERIC(3) NOT NULL
);

create table COMPLETED_TESTS(
	enrolled_id BIGINT references ENROLLED(enrolled_id),
	test_id BIGINT references TESTS(test_id),
	grade NUMERIC(3) NOT NULL
);