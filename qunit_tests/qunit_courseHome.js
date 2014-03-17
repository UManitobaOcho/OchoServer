test("socket should be set up", function(){
	ok(socket, "socket connection should exist");
});

test( "create calendar events for one class day(with correct times)", function() {
	var events = [];
	var times = "M 10:00 am - 11:30 am";
	
	equal(events.length, 0, "There should be zero events");
	events = createEventsForDay(events, 0, times);
	equal(events.length, 52, "There should be 52 events. One for each week");
});

test( "create calendar events for all class days (with multiple days)", function() {
	var events = [];
	var times = "MWF 10:00 am - 11:30 am";
	
	equal(events.length, 0, "There should be zero events");
	events = createDatesForClassTimes(times);
	equal(events.length, 154 , "There should be 154 events. Either 52 or 51 events per year (dependant on whether first monday of year is in second or first week of year.");
});

test( "create calendar events for all class days(with only one day)", function() {
	var events = [];
	var times = "M 10:00 am - 11:30 am";
	
	equal(events.length, 0, "There should be zero events");
	events = createDatesForClassTimes(times);
	equal(events.length, 52 , "There should be 52 events. ");
});

test( "create calendar events for all class days(with no days)", function() {
	var events = [];
	var times = "Online";
	
	equal(events.length, 0, "There should be zero events");
	events = createDatesForClassTimes(times);
	equal(events.length, 0 , "There should be zero events. ");
	
	times = "10:00 am - 11:30 am";
	equal(events.length, 0, "There should be zero events");
	events = createDatesForClassTimes(times);
	equal(events.length, 0 , "There should be zero events. ");
});

test("test getting date from day returned in milliseconds(with year 0 and day 0)", function() {
	var milliseconds = dateFromDayInMilliseconds(0, 0);
	equal(milliseconds, -2209053600000, "Date with day and year equal 0, should equal -2209053600000 in milliseconds");
});

test("test getting date from day returned in milliseconds(365th day of 2014)", function() {
	var milliseconds = dateFromDayInMilliseconds(2014, 365);
	equal(milliseconds, 1420005600000, "365th day of 2014, should equal 1420005600000 in milliseconds");
});