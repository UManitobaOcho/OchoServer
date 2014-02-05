create table STUDENTS(
	student_id 	BIGINT UNIQUE,
	username 	VARCHAR(25) NOT NULL,
	first_name 	VARCHAR(25) NOT NULL,
	last_name 	VARCHAR(25) NOT NULL,
	email 		VARCHAR(50) NOT NULL,
	password 	VARCHAR(50) NOT NULL,
	settings_id 	BIGINT
);

alter table STUDENTS add primary key (student_id);

create table PROFESSORS(
	prof_id 	BIGINT UNIQUE,
	username	VARCHAR(25) NOT NULL,
	prof_name 	VARCHAR(50) NOT NULL,
	email 		VARCHAR(50) NOT NULL,
	password	VARCHAR(50) NOT NULL,
	office_hours	VARCHAR(500),
	settings_id	BIGINT,
	is_TA		BOOLEAN
);

alter table PROFESSORS add primary key (prof_id);

insert into STUDENTS values(
	1,
	'umplishk',
	'Alexander',
	'Plishka',
	'umplishk@myumanitoba.ca',
	'password',
	1
);

insert into PROFESSORS values(
	1,
	'cszapp',
	'Michael Zapp',
	'zapp@cs.umanitoba.ca',
	'password',
	'None',
	2,
	FALSE
	
);
	