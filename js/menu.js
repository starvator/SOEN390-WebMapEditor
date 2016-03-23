/*
    This JavaScript file contains all scripts relate to operation of the menus
*/

var current_tool = "none";

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

    nodeEditingMode = false;
}

function showNodesMenu()
{
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