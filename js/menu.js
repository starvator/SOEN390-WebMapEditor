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
	
	nodeEditingMode = true;
}

function showMainMenu()
{
	$("#sidebarMenu > div").hide();
	$("#mainMenu").show();
	
	// Reset drawing modes
	nodeEditingMode = false;
	lastSelectedNode = null;
}