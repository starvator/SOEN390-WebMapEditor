//remember to check http://api.qunitjs.com/ so you write test code properly

//testing test, to test if tests are testing
QUnit.test( "basic tests", function( assert ) {
	assert.ok( true, "true succeeds" );
	assert.ok( "non-empty", "non-empty string succeeds" );
	
	var souvlaki = 1;
	assert.equal( souvlaki, 1, "NUMBER ONE NUMBER ONE STOP STOP STOP SOUVLAKI STOP" );
});