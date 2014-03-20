test("socket should be set up", function(){
	ok(socket, "socket connection should exist");
});

test("test class times are formatted correctly", function(){
	var days = [];
	days[0] = {'value': 'M'};
	days[1] = {'value': 'W'};
	days[2] = {'value': 'F'};
	
	var start = '03:30 AM';
	var end = '04:45 AM';
	var expected = 'MWF 03:30 AM - 04:45 AM';
	
	var result = classTimeToStringWithVars(days, start, end);
	ok(result, "Result should not be null");
	equal(result, expected, "Result should match expected value");
});
