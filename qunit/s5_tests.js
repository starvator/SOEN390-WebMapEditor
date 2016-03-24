QUnit.test( "Sprint 5 user story 2.3: point deletion", function( assert ) {
	assert.ok( 1 == "0", "point successfully deleted");
});

QUnit.test( "Sprint 5 user story 2.4: point movement", function( assert ) {
	assert.ok( 1 == "0", "point successfully moved");
	assert.ok( 1 == "0", "paths to point remain in correct position");
});

QUnit.test( "Sprint 5 user story 3.2: independent path placement", function( assert ) {
	changeNodeEditorTool("edge");
	canvasClick(100,100);
	canvasClick(100,200);
	//place two points, or use two pre-existing points (like form s4_tests.js)
	//connect them with an edge
	assert.ok( 1 == "0", "path successfully placed.");
	//try connecting two points that already have an edge between them
	assert.ok( 1 == "0", "path not duplicated.");
});

QUnit.test( "Sprint 5 user story 3.3: path deletion", function( assert ) {
	assert.ok( 1 == "0", "path successfully deleted.");
});

QUnit.test( "Sprint 5 user story 6.4: point of interest movement", function( assert ) {
	assert.ok( 1 == "0", "point of interest successfully moved.");
});

QUnit.test( "Sprint 5 user story 6.5: point of interest deletion", function( assert ) {
	assert.ok( 1 == "0", "point of inteerest successfully deleted.");
});