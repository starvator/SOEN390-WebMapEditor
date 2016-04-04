/*
    A series of functions to show alerts
*/


// Show the yellow warning alert box with a specified message
function showWarningAlert(msg)
{
    $("#warningAlertMessage").html(msg);
    $(".alert").hide();
    $("#warningAlert").show();

    showAlert(msg);
}

// Show the red error alert box with a specified message
function showErrorAlert(msg) {
    $("#errorAlertMessage").html(msg);
    $(".alert").hide();
    $("#errorAlert").show();

    showAlert(msg);
}

// Show the alert container and then set a timeout for the hide
function showAlert(msg) {

    var height = $("#alertContainer").height();

    $("#alertContainer").css("top", -1 * height);
    $("#alertContainer").show();
    $("#alertContainer").animate({"top": 0}, 250, "swing", function() {
        // Set a timeout to hide the message after the animation is done
        // Set the amount of time to be a function of the length of the message
        setTimeout(hideAlert, 5000 + msg.length * 20);
    });
}

// Hide the alert container
function hideAlert()
{
    var height = $("#alertContainer").height();

    // Slide up, then hide and reset the position
    $("#alertContainer").animate({"top": -1 * height}, 250, "swing", function() {
        $("#alertContainer").hide();
        $("#alertContainer").css("top", 0);
    });
}