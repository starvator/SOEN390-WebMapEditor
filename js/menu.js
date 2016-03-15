/*
    This JavaScript file contains all scripts relate to operation of the menus
*/

function showFloorsMenu()
{
    $("#nodeEditorMenu").hide();
    $("#MapLayoutMainMenu").hide();
    $("#floorEditorMenu").show();

    nodeEditingMode = false;
}

function showNodesMenu()
{
    $("#floorEditorMenu").hide();
    $("#MapLayoutMainMenu").hide();
    $("#nodeEditorMenu").show();

    nodeEditingMode = true;
}

function showMainMenu()
{
    // main menu back button action
    $("#floorEditorMenu").hide();
    $("#nodeEditorMenu").hide();
    $("#MapLayoutMainMenu").show();

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
    storylinesEditingMode = false;
}

function showStorylinesMenu()
{
    //Reset any menus on the map layout menu
    showMainMenu();

    $("#MapLayoutMenu").hide();
    $("#MapLayoutTab").removeClass('active');
    $("#StorylinesMenu").show();
    $("#StorylinesTab").addClass('active');

    storylinesEditingMode = true;
    nodeEditingMode = false;
}

