/*
    This JavaScript file contains all scripts relate to operation of the menus
*/

// The current POT tool (none, stair, ramp, etc.)
var current_tool = "none";

// The node editing tool (place point, create edge, move point, etc.)
var current_node_tool = "point";

$(document).ready(function(){
    // Set the click event on the POTs to change the current tool
    $("#POTMenu > #POTIconsContainer > .btn").click(function () {
        current_tool = $(this).data("pot-type");
        $("#POTMenu > #POTIconsContainer > .btn").removeClass("active");
        $(this).addClass("active");
    });

    // Enable tooltips
    $("#POTMenu > #POTIconsContainer > .btn").tooltip();
});

function showFloorsMenu()
{
    $("#nodeEditorMenu").hide();
    $("#MapLayoutMainMenu").hide();
    $("#floorEditorMenu").show();
    hidePOTMenu();

    // Reset selected node editing tool
    updateNodeEditorTool($("#placeNodeButton"));

    nodeEditingMode = false;
}

function showNodesMenu()
{
    if(floorList.length == 0){
        bootbox.alert("Please create a floor first.", function() {
        });
        return;
    }

    $("#floorEditorMenu").hide();
    $("#MapLayoutMainMenu").hide();
    $("#nodeEditorMenu").show();
    showPOTMenu();

    nodeEditingMode = true;
}

function showMainMenu()
{
    // main menu back button action
    $("#floorEditorMenu").hide();
    $("#nodeEditorMenu").hide();
    $("#MapLayoutMainMenu").show();
    hidePOTMenu();

    // Reset selected node editing tool
    updateNodeEditorTool($("#placeNodeButton"));

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

function showPOTMenu() {
    var height = $("#POTMenu").height();

    $("#POTMenu").css("margin-top", -1 * height);

    // Place all the buttons off the menu, then progressively animate them into view
    jQuery.each( $("#POTMenu > #POTIconsContainer > .btn"), function( i, btn ) {

        // Don't animate the first button for spacing reasons
        if(i === 0) {
            return true;
        }

        $(btn).css("margin-top", -2 * height);

        // Later buttons are delayed
        setTimeout(function() {$(btn).animate({"margin-top": 0}, 250, "swing", function() {}); }, 5 * i + 30 * i);
    });

    // Show and animate the menu
    $("#POTMenu").show();
    $("#POTMenu").animate({"margin-top": 0}, 250, "swing", function() {});
}

function hidePOTMenu() {
    var height = $("#POTMenu").height();

    // Animate the menu up
    $("#POTMenu").animate({"margin-top": -1 * height}, 250, "swing", function() {
        // Hide and reset the menu
        $("#POTMenu").hide();
        $("#POTMenu").css("margin-top", 0);
    });

}

// Click on a node editor tool
function changeNodeEditorTool(btn)
{
    var previousTool = current_node_tool;
    
    updateNodeEditorTool(btn);
    
    // If switching between point or omni tools or vice-versa, don't reanimate the POT menu
    if(_.intersection([$(btn).data("node-tool"), previousTool], ["point", "omniTool"]).length === 2)
    {
        return;
    }
    
    if(current_node_tool === "point" || current_node_tool === "omniTool")
    {
        showPOTMenu();
    }
    else
    {
        hidePOTMenu();
    }
}

// Switch to a node editor tool
function updateNodeEditorTool(btn)
{
    // Don't do anything if the tool is already selected
    if($(btn).data("node-tool") === current_node_tool)
    {
        return false;
    }

    // Remove the active button
    $("#nodeEditorMenu .btn").removeClass("active");

    // Make the clicked button active
    $(btn).addClass("active");

    // Cancel anything the current tool is doing
    cancelOperations();

    // Change the tool
    current_node_tool = $(btn).data("node-tool");
}

function deleteActiveStoryline(){
    bootbox.confirm("Deleting this storyline will delete all data associated with it, including StoryPoint information. Are you sure you want to delete this storyline?", function(result) {
                if(!result){
                    return;
                }
                else{
                    deleteStoryLine();
                }
                return result;
            });
}

function changeLanguage() {
    currentLanguage = $("#languageDropdown :selected").val();
}