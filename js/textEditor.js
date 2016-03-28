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
                    POIList[val].media = $("#attachedDocName").text();
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
                currentPOI.media = $("#attachedDocName").text();
                currentPOI.isSet = true;
                currentPOI.isAutoOn = $("#autoOn").parent().hasClass("active");
                POIList.push(currentPOI);
				
				//Remove POT it used to be
				POTList = _.reject(POTList, function(el) { return el.point.x === currentPOI.point.x && el.point.y === currentPOI.point.y; });
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
                            POIList[val].storyPoint[p].media = $("#attachedDocName").text();
                            POIList[val].isAutoOn = $("#autoOn").parent().hasClass("active");
                            //Adding the point to the storyline list.
                            //get into <a> and change POIList[val].title
                            $("#"+POIList[val].storyPoint[p].ID+"_a").text(POIList[val].storyPoint[p].title);
                            storylineList[active_id].path.push(currentPOI.ID);
                            spCreated = true;
                        }
                    }
                    //If it wasnt found in the loop, create it.
                    if(!spCreated){
                        //Create storypoint
                        var newStoryPoint = new StoryPoint();
                        newStoryPoint.title = $("#spTitle").val();
                        newStoryPoint.description = CKEDITOR.instances["editor1"].getData();
                        newStoryPoint.media = $("#attachedDocName").text();
                        POIList[val].storyPoint.push(newStoryPoint);
                        //Adding the point to the storyline list.
                        $("#"+active_id+"_pointList").append('<li><a id = "' + newStoryPoint.ID + '_a"onClick = "openEditorByPointID('+ newStoryPoint.ID +')">'+ newStoryPoint.title +'</a></li>');
                        storylineList[active_id].path.push(currentPOI.ID);
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
            $("#attachedDocName").text(poi.media);
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
                    $("#attachedDocName").text(currentPOI.storyPoint[p].media);
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