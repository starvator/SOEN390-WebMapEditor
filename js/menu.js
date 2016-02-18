/*
	This JavaScript file contains all scripts relate to operation of the menus
*/

function showFloorsMenu()
{
	$("#nodeEditorMenu").hide();
	$("#floorEditorMenu").show();
	
	nodeEditingMode = false;
}

function showNodesMenu()
{
	$("#floorEditorMenu").hide();
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

function showMapLayoutMenu()
{
	$("#StorylinesMenu").hide();
	$("#StorylinesTab").removeClass('active');
	$("#MapLayoutMenu").show();
	$("#MapLayoutTab").addClass('active');
	
	nodeEditingMode = false;
}

function showStorylinesMenu()
{
	$("#MapLayoutMenu").hide();
	$("#MapLayoutTab").removeClass('active');
	$("#StorylinesMenu").show();
	$("#StorylinesTab").addClass('active');
	
	storylinesEditingMode = true;
	nodeEditingMode = false;
}

$(document).ready(function(){
    $("#StorylinesMenu a").on("click", function(){
       $("#StorylinesMenu").find(".active").removeClass("active");
       $(this).parent().addClass("active");
    });
});