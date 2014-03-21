test("Check that grade % to letter conversion is correct", function(){
	for(var i = 90; i <= 100; i++){
		var c = convertNumberToLetterGrade(i);
		equal(c, 'A', "Should be an A grade with grade: " + i);
	}	

	for(var i = 80; i <= 89; i++){
		var c = convertNumberToLetterGrade(i);
		equal(c, 'B', "Should be an A grade with grade: " + i);
	}	

	for(var i = 70; i <= 79; i++){
		var c = convertNumberToLetterGrade(i);
		equal(c, 'C', "Should be an A grade with grade: " + i);
	}	

	for(var i = 60; i <= 69; i++){
		var c = convertNumberToLetterGrade(i);
		equal(c, 'D', "Should be an A grade with grade: " + i);
	}	

	for(var i = 0; i <= 59; i++){
		var c = convertNumberToLetterGrade(i);
		equal(c, 'F', "Should be an A grade with grade: " + i);
	}	
});
