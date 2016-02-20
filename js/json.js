

function createJSON() {
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
		node:{'poi':POIList, 'pot':[]},
		edge:edgeList,
		storyline:storylineList
		});
}