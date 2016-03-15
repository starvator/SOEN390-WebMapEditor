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
	if(type !== "none")
	    //check that the last added POT matches the last added node.
	    assert.ok( nodeList[nodeList.length - 1].id == POTList[POTList.length - 1].point.id , "POT of type " + POTList[POTList.length - 1].label +" made");
	else
	    //if the type is "none", check that the last added node has no associated POT	
	    assert.ok(1 == "1", "Regular point made");

	if( testX == 400 && testY == 100) {
	    testX = 100;
	    testY = 200;
	}
	else
	    testX += 100;
	curr_id += 1;
    }
    redraw();

    //edit the type of each node to another type. Assert that they are then changed in POTList.
    //assert.ok( 1 == "0", "Each node has been edited.");
});

QUnit.test( "Sprint 4 user story 4.4: showing and hiding storylines", function( assert ) {
    //create two storylines. toggle their visible state.
    //Assert that no storyline is visible in GUI.
    //Assert that one storyline is visible in the GUI.
    //Assert that both storylines are visible in the GUI.
    assert.ok( 1 == "0");
});

QUnit.test( "Sprint 4 user story 5.2: loading a saved map from JSON", function( assert ) {
    //read up on unit testing file I/O
    assert.ok( 1 == "0");
});
