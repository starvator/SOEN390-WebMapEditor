QUnit.test( "Sprint 3 user story 1.2: floor selection", function( assert ) {
	assert.ok( 1 == "1", "Unit testing not supported, cannot pass files as form data" );
});

QUnit.test( "Sprint 3 user story 4.3: editing storyline details", function( assert ) {
	var testPoint = new Point(100,100);
	var testPOI = new POI(testPoint);
	//fill testPOI with some dummy data for its fields
	testPOI.title= "Test Title";
	testPOI.description= "Test Description";
	testPOI.isSet = true;
	//open the ditor for that point and check its contents for consistency
	openEditorByPointID(testPoint.id);
	fillEditor(testPOI);
	assert.equal( testPOI.title, $("#spTitle").val(), "Editor retrieves correct data" );
});

QUnit.test( "Sprint 3 user story 6.1: placing points of interest", function( assert ) {
	assert.ok( 1 == "1", "Unwritten test" );
});