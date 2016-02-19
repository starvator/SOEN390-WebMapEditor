

function createJSON() {
	generateJSONPointList();
	/*
	JSON File Outline, as specified and agreed upon by team leaders
		floorplan
		node
			poi
			pot
		edge
		storyline
	*/
	return JSON.stringify({
		floorPlan:floorList,
		node:{'poi':pointList, 'pot':[]},
		edge:edgeList,
		storyline:storylineList
		});
}

function generateJSONPointList() {
//Temporary fix to turn nodeList to pointList
//Actual fix beyond scope of SVKLI-16
	pointList = [];
	for(p of nodeList) {
		pointList.push(new POI(p));
	}
}