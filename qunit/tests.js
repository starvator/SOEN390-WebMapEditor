QUnit.test( "Sprint 2 user story 1.3: zooming", function( assert ) {
	//set mouse position, then zoom in.
	//mouse location should remain at same position after zoom.
	var testPoint = new Point(900,900);
	mouseLocation.x = 900;
	mouseLocation.y = 900;
	zoom(3);
	assert.equal(mouseLocation.x, testPoint.x, "mouseX 1");
	assert.equal(mouseLocation.y, testPoint.y, "mouseY 1");
	//set mouse position, then zoom out.
	//mouse location should remain at same position after zoom.
	testPoint.x = 100;
	testPoint.y = 100;
	mouseLocation.x = 100;
	mouseLocation.y = 100;
	zoom(-10);
	assert.equal(mouseLocation.x, testPoint.x, "mouseX 2");
	assert.equal(mouseLocation.y, testPoint.y, "mouseY 2");
});

QUnit.test( "Sprint 2 user story 1.4: panning", function( assert ) {
	//this works but I can't get a visible coordinate just out of the canvas
	$('#floorPlan').simulate("drag-n-drop",{dx:500});
	$('#floorPlan').simulate("drag-n-drop",{dy:200});
	assert.ok( 1 == "0", "TODO: confirm change in position via 'assert' for automation" );
});
QUnit.test( "Sprint 2 user story 4.2", function( assert ) {
	assert.ok( 1 == "0", "Unwritten test" );
});
QUnit.test( "Sprint 2 user story 5.1", function( assert ) {
	assert.ok( 1 == "0", "Unwritten test" );
});
QUnit.test( "Sprint 2 user story 6.2", function( assert ) {
	assert.ok( 1 == "0", "Unwritten test" );
});
