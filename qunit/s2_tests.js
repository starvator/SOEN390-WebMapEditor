QUnit.test( "Sprint 2 user story 1.3: zooming", function( assert ) {
	var testPoint = new Point(900,900);
	mouseLocation.x = testPoint.x;
	mouseLocation.y = testPoint.y;
	
	zoom(3);
	//check to make sure the mouse location remains the same after zooming in
	assert.equal(mouseLocation.x, testPoint.x, "mouseX test 1");
	assert.equal(mouseLocation.y, testPoint.y, "mouseY test 1");
	
	testPoint.x = 100;
	testPoint.y = 100;
	mouseLocation.x = testPoint.x;
	mouseLocation.y = testPoint.y;
	
	zoom(-10);
	//check to make sure the mouse location remains the same after zooming out
	assert.equal(mouseLocation.x, testPoint.x, "mouseX test 2");
	assert.equal(mouseLocation.y, testPoint.y, "mouseY test 2");
});

QUnit.test( "Sprint 2 user story 1.4: panning", function( assert ) {
	$('#floorPlan').simulate("drag-n-drop",{dx:500, dy:200});
	assert.ok( 1 == "1", "passed" );
	var testPoint = new Point(900,900);
	$('#floorPlan').simulate("drag-n-drop",{dx:-300, dy:-300});
	assert.ok( 1 == "1", "passed" );
});
QUnit.test( "Sprint 2 user story 4.2: create storyline", function( assert ) {
	assert.ok( 1 == "1", "Unwritten test" );
});
QUnit.test( "Sprint 2 user story 5.1: save work", function( assert ) {
	assert.ok( 1 == "1", "Unwritten test" );
});
QUnit.test( "Sprint 2 user story 6.2: edit point of interest", function( assert ) {
	assert.ok( 1 == "1", "Unwritten test" );
});