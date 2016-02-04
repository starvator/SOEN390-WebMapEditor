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
	nodeDrawMode = true;
}

function showMainMenu()
{
	$("#sidebarMenu > div").hide();
	$("#mainMenu").show();
	
	nodeDrawMode = false;
}