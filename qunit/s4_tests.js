//remove extraneous comments (like this one) before pushing!
QUnit.test( "Sprint 4 user story 2.2: point editing (bathroom, stair, etc)", function( assert ) {
    //setup to place POTs on the map
    nodeEditingMode = true;
    mouseOnNode = false;
    lastSelectedNode = false;
    var testX = 100;
    var testY = 100;
    var curr_id = 1;
    for(var type in POTtypes) {
	current_tool = type;
	canvasClick(testX,testY);

	//check that the last added POT matches the last added node.
	assert.ok( nodeList[nodeList.length - 1].id == POTList[POTList.length - 1].id , "POT of type " + POTList[POTList.length - 1].label +" made");

	if( testX == 400 && testY == 100) {
	    testX = 100;
	    testY = 200;
	}
	else
	    testX += 100;
	curr_id += 1;
    }
    //edit the type of each node to another type. Assert that they are then changed in POTList.
    //assert.ok( 1 == "0", "Each node has been edited.");
});

QUnit.test( "Sprint 4 user story 4.4: showing and hiding storylines", function( assert ) {
    //create two storylines. toggle their visible state.
	$("#storylineField").val("4.4 Storyline 1");
	$("#storylineDescription").val("");
	addNewStoryLine();
	$("#storylineField").val("4.4 Storyline 2");
	$("#storylineDescription").val("");
	addNewStoryLine();
    //Assert that when storyline 1 is active, storyline 2 is inactive, and vice versa.
    storylineClicked($("#1"));
	assert.ok($("#1").is(".active"), "storyline 1 is set to active");
	assert.notOk($("#2").is(".active"), "storyline 2 is not set to active");
	
	storylineClicked($("#2"));
	assert.notOk($("#1").is(".active"), "storyline 1 is not set to active");
	assert.ok($("#2").is(".active"), "storyline 2 is set to active");
});

QUnit.test( "Sprint 4 user story 5.2: loading a saved map from JSON", function( assert ) {
    //read up on unit testing file I/O
    assert.ok( 1 == "0");
});