test("socket should be set up", function(){
	ok(socket, "socket connection should exist");
});

//verify list
test( "Test Drop down verification", function() {
	var result = false;
	var selector = document.createElement("form");
	var option;

	option = document.createElement("option");
	option.text = "Comp4350";
	option.val = "1";
	selector.add(option);


	result = verifyList(options);
	equal(options, true , "This should be valid");
});

//verify student