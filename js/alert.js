/*
    A series of functions to show alerts
*/


// Show the warning alert box with a specified message
function showWarningAlert(msg)
{
    $("#alertMessage").html(msg);
    var height = $("#alertContainer").height();

    $("#alertContainer").css("top", -1 * height);
    $("#alertContainer").show();
    $("#alertContainer").animate({"top": 0}, 250, "swing", function() {
        // Set a timeout to hide the message after the animation is done
        // Set the amount of time to be a function of the length of the message
        setTimeout(hideAlert, 5000 + msg.length * 20);
    });
}

function hideAlert()
{
    var height = $("#alertContainer").height();

    // Slide up, then hide and reset the position
    $("#alertContainer").animate({"top": -1 * height}, 250, "swing", function() {
        $("#alertContainer").hide();
        $("#alertContainer").css("top", 0);
    });
}