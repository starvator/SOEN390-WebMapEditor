QUnit.test( "Sprint 5 user story 2.3: point deletion", function( assert ) {
	//generate a new point on the map
	nodeEditingMode = true;
    mouseOnNode = false;
    lastSelectedNode = false;
    var delX = 600;
    var delY = 600;
	current_tool = "stair";
	current_node_tool = "point";
	canvasClick(delX,delY);
	var numNodes = nodeList.length;
	var numPots = POTList.length;
	var lastNode = nodeList[nodeList.length - 1];
	//remove the point and assert that it does not exist in any relevant list
	deleteNode(nodeList[nodeList.length - 1]);
	assert.ok( nodeList.length == numNodes - 1, "node object successfully deleted");
	assert.ok( POTList.length == numPots - 1, "POT object successfully deleted");
	
	//connect one node to another with an edge
	edgeList.push(new Edge(nodeList[0],nodeList[1]));
	var numEdges = edgeList.length;
	//delete one of the nodes and assert that the edge is also deleted
	deleteNode(nodeList[1]);
	assert.ok( edgeList.length == numEdges - 1, "edge connected to a deleted node has also been deleted");
});

QUnit.test( "Sprint 5 user story 2.4: point movement", function( assert ) {
	assert.ok( 1 == "0", "point successfully moved");
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