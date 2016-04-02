var currentPOI;
$(document).ready(function(){
    //The x at the top
    $("#infoEditingFormClose").click(function(){
        $("#infoEditingForm").hide();
        $("#modal").hide();
    });

    //When you click the attach button
    $("#attachADoc").click(function(){
        $("#uploadFile").trigger('click');
    });

    //On change on input
    $( "#uploadFile" ).change(function() {
        try{
            tempList = "";
            for (var val in $('#uploadFile')[0].files){
                tempName = $('#uploadFile')[0].files[val].name;
                if (tempName === undefined || tempName === "item"){
                    break;
                }
                tempList += tempName + ", ";
            }
            tempList = tempList.substring(0, tempList.length - 2);
        $("#attachedDocName").text(tempList);
        }
        //if you click cancel in a dialog, it will clear the input, so catch and ignore
        catch (e){
        }
    });

    //When you click the x on the attach file
    $("#clearAttachField").click(function(){
        $("#attachedDocName").text("");
    });

    //The save button
    $("#SaveStoryPointInfo").click(function(){
    if($("#spTitle").val() != ""){
        var spCreated = false;
        //if not saving a storyPoint
        if(active_id == -2){
            if(!_.contains(POIList, currentPOI)){
                POIList.push(currentPOI);
            }
            for(var val in POIList){
                if(POIList[val].ID === currentPOI.ID){
                    POIList[val].title = $("#spTitle").val();
                    POIList[val].ibeacon.uuid = $("#spBeaconID").val();
                    POIList[val].ibeacon.major = $("#spBeaconMajor").val();
                    POIList[val].ibeacon.minor = $("#spBeaconMinor").val();
                    POIList[val].description = CKEDITOR.instances["editor1"].getData();
                    var fileNamesText = $("#attachedDocName").text().split(", ");
                    var fileNameExtension;
                    var tempFileObject;
                    POIList[val].media = new Media();
                    if (fileNamesText[0]!=""){
                    for (var val2 in fileNamesText){
                        fileNameExtension = fileNamesText[val2].split(".")[1];
                        //image file
                        if (fileNameExtension == "png" || fileNameExtension == "jpg" || fileNameExtension == "jpeg" || fileNameExtension == "jfif" || fileNameExtension == "bmp" || fileNameExtension == "tif" || fileNameExtension == "tiff" || fileNameExtension == "gif" || fileNameExtension == "svg"){
                            tempFileObject = new File("image",fileNamesText[val2]);
                        }
                        //video file
                        else if (fileNameExtension == "webm" || fileNameExtension == "mkv" || fileNameExtension == "flv" || fileNameExtension == "gifv" || fileNameExtension == "vob" || fileNameExtension == "avi" || fileNameExtension == "mov" || fileNameExtension == "wmv" || fileNameExtension == "mp4" || fileNameExtension == "m4p" || fileNameExtension == "mpg" || fileNameExtension == "mpeg" || fileNameExtension == "mpv" || fileNameExtension == "3gp" || fileNameExtension == "flv" || fileNameExtension == "f4v") {
                            tempFileObject = new File("video",fileNamesText[val2]);
                        }
                        //audio file
                        else if (fileNameExtension == "3gp" || fileNameExtension == "aac" || fileNameExtension == "flac" || fileNameExtension == "gifv" || fileNameExtension == "mp3" || fileNameExtension == "m4a" || fileNameExtension == "m4b" || fileNameExtension == "m4p" || fileNameExtension == "wav" || fileNameExtension == "m4p" || fileNameExtension == "wma") {
                            tempFileObject = new File("audio",fileNamesText[val2]);
                        }
                        //not supported
                        else {
                            showErrorAlert(fileNamesText[val2] + " is not of a supported file type. It was automatically discarded.");
                            break;
                        }
                        POIList[val].media.addMedia(tempFileObject);
                    }
                    }
                    POIList[val].isSet = true;
                    POIList[val].isAutoOn = $("#autoOn").parent().hasClass("active");
                    break;
                }
            }
        }
        else{
            var exists = false;
            for(var val in POIList){
                if(POIList[val].ID === currentPOI.ID){
                    exists = true;
                }
            }
            if(!exists){
                currentPOI.title = $("#spTitle").val();
                currentPOI.ibeacon.uuid = $("#spBeaconID").val();
                currentPOI.ibeacon.major = $("#spBeaconMajor").val();
                currentPOI.ibeacon.minor = $("#spBeaconMinor").val();
                currentPOI.description = CKEDITOR.instances["editor1"].getData();
                var fileNamesText = $("#attachedDocName").text().split(", ");
                    var fileNameExtension;
                    var tempFileObject;
                    currentPOI.media = new Media();
                    if (fileNamesText[0]!=""){
                    for (var val2 in fileNamesText){
                        fileNameExtension = fileNamesText[val2].split(".")[1];
                        //image file
                        if (fileNameExtension == "png" || fileNameExtension == "jpg" || fileNameExtension == "jpeg" || fileNameExtension == "jfif" || fileNameExtension == "bmp" || fileNameExtension == "tif" || fileNameExtension == "tiff" || fileNameExtension == "gif" || fileNameExtension == "svg"){
                            tempFileObject = new File("image",fileNamesText[val2]);
                        }
                        //video file
                        else if (fileNameExtension == "webm" || fileNameExtension == "mkv" || fileNameExtension == "flv" || fileNameExtension == "gifv" || fileNameExtension == "vob" || fileNameExtension == "avi" || fileNameExtension == "mov" || fileNameExtension == "wmv" || fileNameExtension == "mp4" || fileNameExtension == "m4p" || fileNameExtension == "mpg" || fileNameExtension == "mpeg" || fileNameExtension == "mpv" || fileNameExtension == "3gp" || fileNameExtension == "flv" || fileNameExtension == "f4v") {
                            tempFileObject = new File("video",fileNamesText[val2]);
                        }
                        //audio file
                        else if (fileNameExtension == "3gp" || fileNameExtension == "aac" || fileNameExtension == "flac" || fileNameExtension == "gifv" || fileNameExtension == "mp3" || fileNameExtension == "m4a" || fileNameExtension == "m4b" || fileNameExtension == "m4p" || fileNameExtension == "wav" || fileNameExtension == "m4p" || fileNameExtension == "wma") {
                            tempFileObject = new File("audio",fileNamesText[val2]);
                        }
                        //not supported
                        else {
                            break;
                        }
                        currentPOI.media.addMedia(tempFileObject);
                    }
                    }
        
                currentPOI.isSet = true;
                currentPOI.isAutoOn = $("#autoOn").parent().hasClass("active");
                POIList.push(currentPOI);

                var oldPOT = _.find(POTList, function(item) { return item.ID === currentPOI.ID; });

                //Remove POT it used to be
                POTList = _.reject(POTList, function(el) { return el === oldPOT; });

                // Replace it in the node list
                nodeList = _.reject(nodeList, function(el) { return el === oldPOT; });
                nodeList.push(currentPOI);

                // Replace in the edge list
                for(var i = 0; i < edgeList.length; i++)
                {
                    if(edgeList[i].origin === oldPOT)
                    {
                        edgeList[i].origin = currentPOI;
                    }

                    if(edgeList[i].destination === oldPOT)
                    {
                        edgeList[i].destination = currentPOI;
                    }
                }
            }
            for(val in POIList){
                if(POIList[val].ID === currentPOI.ID){
                    for(var p in POIList[val].storyPoint){
                        if (POIList[val].storyPoint[p].storylineID == active_id){
                            //Updating sp
                            POIList[val].storyPoint[p].title = $("#spTitle").val();
                            POIList[val].ibeacon.uuid = $("#spBeaconID").val();
                            POIList[val].ibeacon.major = $("#spBeaconMajor").val();
                            POIList[val].ibeacon.minor = $("#spBeaconMinor").val();
                            POIList[val].storyPoint[p].description = CKEDITOR.instances["editor1"].getData();
                            var fileNamesText = $("#attachedDocName").text().split(", ");
                            var fileNameExtension;
                            var tempFileObject;
                            POIList[val].media = new Media();
                            if (fileNamesText[0]!=""){
                            for (var val2 in fileNamesText){
                                fileNameExtension = fileNamesText[val2].split(".")[1];
                                //image file
                                if (fileNameExtension == "png" || fileNameExtension == "jpg" || fileNameExtension == "jpeg" || fileNameExtension == "jfif" || fileNameExtension == "bmp" || fileNameExtension == "tif" || fileNameExtension == "tiff" || fileNameExtension == "gif" || fileNameExtension == "svg"){
                                    tempFileObject = new File("image",fileNamesText[val2]);
                                }
                                //video file
                                else if (fileNameExtension == "webm" || fileNameExtension == "mkv" || fileNameExtension == "flv" || fileNameExtension == "gifv" || fileNameExtension == "vob" || fileNameExtension == "avi" || fileNameExtension == "mov" || fileNameExtension == "wmv" || fileNameExtension == "mp4" || fileNameExtension == "m4p" || fileNameExtension == "mpg" || fileNameExtension == "mpeg" || fileNameExtension == "mpv" || fileNameExtension == "3gp" || fileNameExtension == "flv" || fileNameExtension == "f4v") {
                                    tempFileObject = new File("video",fileNamesText[val2]);
                                }
                                //audio file
                                else if (fileNameExtension == "3gp" || fileNameExtension == "aac" || fileNameExtension == "flac" || fileNameExtension == "gifv" || fileNameExtension == "mp3" || fileNameExtension == "m4a" || fileNameExtension == "m4b" || fileNameExtension == "m4p" || fileNameExtension == "wav" || fileNameExtension == "m4p" || fileNameExtension == "wma") {
                                    tempFileObject = new File("audio",fileNamesText[val2]);
                                }
                                //not supported
                                else {
                                    showErrorAlert(fileNamesText[val2] + " is not of a supported file type. It was automatically discarded.");
                                    break;
                                }
                                POIList[val].storyPoint[p].media.addMedia(tempFileObject);
                            }
                            }
                            POIList[val].isAutoOn = $("#autoOn").parent().hasClass("active");
                            //Adding the point to the storyline list.
                            //get into <a> and change POIList[val].title
                            $("#"+POIList[val].storyPoint[p].ID+"_a").text(POIList[val].storyPoint[p].title);
                            spCreated = true;
                        }
                    }
                    //If it wasnt found in the loop, create it.
                    if(!spCreated){
                        //Create storypoint
                        var newStoryPoint = new StoryPoint();
                        newStoryPoint.title = $("#spTitle").val();
                        newStoryPoint.description = CKEDITOR.instances["editor1"].getData();
                        var fileNamesText = $("#attachedDocName").text().split(", ");
                            var fileNameExtension;
                            var tempFileObject;
                            newStoryPoint.media = new Media();
                            if (fileNamesText[0]!=""){
                            for (var val2 in fileNamesText){
                                fileNameExtension = fileNamesText[val2].split(".")[1];
                                //image file
                                if (fileNameExtension == "png" || fileNameExtension == "jpg" || fileNameExtension == "jpeg" || fileNameExtension == "jfif" || fileNameExtension == "bmp" || fileNameExtension == "tif" || fileNameExtension == "tiff" || fileNameExtension == "gif" || fileNameExtension == "svg"){
                                    tempFileObject = new File("image",fileNamesText[val2]);
                                }
                                //video file
                                else if (fileNameExtension == "webm" || fileNameExtension == "mkv" || fileNameExtension == "flv" || fileNameExtension == "gifv" || fileNameExtension == "vob" || fileNameExtension == "avi" || fileNameExtension == "mov" || fileNameExtension == "wmv" || fileNameExtension == "mp4" || fileNameExtension == "m4p" || fileNameExtension == "mpg" || fileNameExtension == "mpeg" || fileNameExtension == "mpv" || fileNameExtension == "3gp" || fileNameExtension == "flv" || fileNameExtension == "f4v") {
                                    tempFileObject = new File("video",fileNamesText[val2]);
                                }
                                //audio file
                                else if (fileNameExtension == "3gp" || fileNameExtension == "aac" || fileNameExtension == "flac" || fileNameExtension == "gifv" || fileNameExtension == "mp3" || fileNameExtension == "m4a" || fileNameExtension == "m4b" || fileNameExtension == "m4p" || fileNameExtension == "wav" || fileNameExtension == "m4p" || fileNameExtension == "wma") {
                                    tempFileObject = new File("audio",fileNamesText[val2]);
                                }
                                //not supported
                                else {
                                    showErrorAlert(fileNamesText[val2] + " is not of a supported file type. It was automatically discarded.");
                                    break;
                                }
                                newStoryPoint.media.addMedia(tempFileObject);
                            }
                            }
                        POIList[val].storyPoint.push(newStoryPoint);
                        //Adding the point to the storyline list.
                        $("#"+active_id+"_pointList").append('<li class="draggable_story_point list-group-item"><span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"></span><a id = "' + newStoryPoint.ID + '_a"onClick = "openEditorByPointID('+ newStoryPoint.ID +')">'+ newStoryPoint.title +'</a></li>');
                        for (var aid in storylineList){
                            if (storylineList[aid].ID == active_id){
                                storylineList[aid].path.push(currentPOI.ID);
                                break;
                            }
                        }
                        spCreated = false;
                    }
                }
            }
        }
            //close the window
            $("#infoEditingForm").hide();
            $("#modal").hide();
            highlightPOI(active_id);
    }
    else{
        showErrorAlert("Enter a Title.");
    }
    });

    $("#DeletePOIButton").click(function(){
        var result = false;
        bootbox.confirm("Are you sure you want to delete the point of interest? This will delete the point of interest and any Storypoint associated with it.", function(result) {
            if(!result){
                return;
            }
            else{
                deletePOI();
                //close the window
                $("#infoEditingForm").hide();
                $("#modal").hide();
            }
            return result;
        });
    });

    $("#DeleteStoryPointButton").click(function(){
        var result = false;
        bootbox.confirm("Are you sure you want to delete the Storypoint?", function(result) {
            if(!result){
                return;
            }
            else{
                deleteStoryPoint();
                //close the window
                $("#infoEditingForm").hide();
                $("#modal").hide();
            }
            return result;
        });
    });

});


//Open editor of of point of a given id
function openEditorByPointID(id){
    for(var val in POIList){
        for (var point in POIList[val].storyPoint){
            if (POIList[val].storyPoint[point].ID == id){
                fillEditor(POIList[val]);
                break;
            }
        }
    }
}

function fillEditor(poi){
    currentPOI = poi;
    var spFound = false;
    var spslExists = false;
    var blank = false;
    var POIOrigin = false;
    //If no storypoint for current active_id
    for(var p in currentPOI.storyPoint){
        if(currentPOI.storyPoint[p].storylineID == active_id){
            spslExists = true;
        }
    }
    if(!spslExists){
        if(poi.isSet){
            $("#spTitle").val(poi.title);
            if(poi.isAutoOn === true){
                $("#autoOn").click();
            }else if(poi.isAutoOn === false){
                $("#autoOff").click();
            }
            $("#spBeaconID").val(poi.ibeacon.uuid);
            $("#spBeaconMajor").val(poi.ibeacon.major);
            $("#spBeaconMinor").val(poi.ibeacon.minor);
            CKEDITOR.instances["editor1"].setData(poi.description);
            var stringForDocField ="";
            var tempFileName;
            for (var val in poi.media.audio){
                tempFileName = poi.media.audio[val].path.split("/");
                stringForDocField += tempFileName[tempFileName.length-1]+", ";
            }
            for (var val in poi.media.image){
                tempFileName = poi.media.image[val].path.split("/");
                stringForDocField += tempFileName[tempFileName.length-1]+", ";
            }
            for (var val in poi.media.video){
                tempFileName = poi.media.video[val].path.split("/");
                stringForDocField += tempFileName[tempFileName.length-1]+", ";
            }

            if(stringForDocField.length!=0){
                stringForDocField = stringForDocField.substring(0, stringForDocField.length - 2);
            }
            $("#attachedDocName").text(stringForDocField);
            POIOrigin = true;
            POIID = poi.ID;
        }
        else{
            $("#spTitle").val("");
            if(poi.isAutoOn === true){
                $("#autoOn").click();
            }else if(poi.isAutoOn === false){
                $("#autoOff").click();
            }
            $("#spBeaconID").val("");
            $("#spBeaconMajor").val("");
            $("#spBeaconMinor").val("");
            CKEDITOR.instances["editor1"].setData("");
            $("#attachedDocName").text("");
            blank = true;
        }
    }
    else{
        if(active_id !== -2){
            //find the storyPoint associated to the storyline
            for(var p in currentPOI.storyPoint){
                if (currentPOI.storyPoint[p].storylineID == active_id){
                    $("#spTitle").val(currentPOI.storyPoint[p].title);
                    if(poi.isAutoOn === true){
                        $("#autoOn").click();
                    }else if(poi.isAutoOn === false){
                        $("#autoOff").click();
                    }
                    $("#spBeaconID").val(currentPOI.ibeacon.uuid);
                    $("#spBeaconMajor").val(poi.ibeacon.major);
                    $("#spBeaconMinor").val(poi.ibeacon.minor);
                    CKEDITOR.instances["editor1"].setData(currentPOI.storyPoint[p].description);
                    
                    var stringForDocField ="";
                    var tempFileName;
                    for (var val in currentPOI.storyPoint[p].media.audio){
                        tempFileName = currentPOI.storyPoint[p].media.audio[val].path.split("/");
                        stringForDocField += tempFileName[tempFileName.length-1]+", ";
                    }
                    for (var val in currentPOI.storyPoint[p].media.image){
                        tempFileName = currentPOI.storyPoint[p].media.image[val].path.split("/");
                        stringForDocField += tempFileName[tempFileName.length-1]+", ";
                    }
                    for (var val in currentPOI.storyPoint[p].media.video){
                        tempFileName = currentPOI.storyPoint[p].media.video[val].path.split("/");
                        stringForDocField += tempFileName[tempFileName.length-1]+", ";
                    }

                    if(stringForDocField.length!=0){
                        stringForDocField = stringForDocField.substring(0, stringForDocField.length - 2);
                    }
                    $("#attachedDocName").text(stringForDocField);
                    
                    spFound = true;
                    POIID= poi.ID;
                }
            }
            //If the storyPoint doesnt exist, create it
            if(!spFound){
                $("#spTitle").val("");
                $("#autoOn").click();
                $("#spBeaconID").val("");
                $("#spBeaconMajor").val("");
                $("#spBeaconMinor").val("");
                CKEDITOR.instances["editor1"].setData("");
                $("#attachedDocName").text("");
                spFound = false;
                blank = true;
            }
        }
    }
    //show the form
    setDeleteEditorButtons(blank,POIOrigin);
    setEditorTitle();
    $("#infoEditingForm").show();
    $("#modal").show();
    setFocus();
}

function setEditorTitle(){
    $("#infoEditingFormTitle").empty();
    if(active_id === -2){
        $("#infoEditingFormTitle").append('Point of Interest Editor');
    }
    else{
        $("#infoEditingFormTitle").append('Storypoint Editor');
    }
}

function setFocus(){
    $("#spTitle").focus();
}

function setDeleteEditorButtons(newItem, poi){
    if (newItem){
        $('#DeletePOIButton').addClass("hidden");
        $('#DeleteStoryPointButton').addClass("hidden");
    }
    //if POI only allow to delete POI
    else if(active_id === -2){
        $('#DeletePOIButton').removeClass("hidden");
        $('#DeleteStoryPointButton').addClass("hidden");
    }
    else if(poi){
        $('#DeletePOIButton').addClass("hidden");
        $('#DeleteStoryPointButton').addClass("hidden");
    }
    //if Storypoint only allow to delete Storypoint
    else {
        $('#DeletePOIButton').addClass("hidden");
        $('#DeleteStoryPointButton').removeClass("hidden");
    }
}