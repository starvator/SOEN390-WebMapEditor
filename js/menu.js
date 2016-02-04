/*
	This JavaScript file contains all scripts relate to operation of the menus
*/

function showFloorsMenu()
{
	$("#mainMenu").hide();
	$("#floorEditorMenu").show();
}

function showNodesMenu()
{
	$("#mainMenu").hide();
	$("#nodeEditorMenu").show();
}

function showMainMenu()
{
	$("#sidebarMenu > div").hide();
	$("#mainMenu").show();
	
	// Reset drawing modes
	placingNodes = false;
	$("#placeNodeButton").removeClass("active");
}

function placeNodes()
{
	if(placingNodes) {
		placingNodes = false;
		$("#placeNodeButton").removeClass("active");
	} else {
		placingNodes = true;
		$("#placeNodeButton").addClass("active");
	}
}