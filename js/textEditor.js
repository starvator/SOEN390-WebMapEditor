var currentPOI;
$(document).ready(function(){
    //The x at the top
    $("#infoEditingFormClose").click(function(){
        $("#infoEditingForm").hide();
    });

    //When you click the attach button
    $("#attachADoc").click(function(){
        $("#uploadFile").trigger('click');
    });

    //On change on input
    $( "#uploadFile" ).change(function() {
        try{
        $("#attachedDocName").text($('#uploadFile')[0].files[0].name);
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

    var spCreated = false;
    //if not saving a storyPoint
    if(active_id == -2){
        POIList.push(currentPOI);
        for(var val in POIList){
            if(POIList[val].ID === currentPOI.ID){
                POIList[val].title = $("#spTitle").val();
                POIList[val].ibeacon = $("#spBeaconID").val();
                POIList[val].description = CKEDITOR.instances["editor1"].getData();
                POIList[val].media = $("#attachedDocName").text();
                POIList[val].isSet = true;
				if($("#autoOn").attr("class") === "btn btn-default active"){
				    POIList[val].isAutoOn = true;
				} else if($("#autoOff").attr("class") === "btn btn-default active") {
				    POIList[val].isAutoOn = false;
				}
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
            currentPOI.ibeacon = $("#spBeaconID").val();
            currentPOI.description = CKEDITOR.instances["editor1"].getData();
            currentPOI.media = $("#attachedDocName").text();
            currentPOI.isSet = true;
			if($("#autoOn").attr("class") == "active"){
				currentPOI.isAutoOn = true;
			} else if($("#autoOff").attr("class") == "active") {
				currentPOI.isAutoOn = false;
			}
            POIList.push(currentPOI);
        }
        for(val in POIList){
            if(POIList[val].ID === currentPOI.ID){
                for(var p in POIList[val].storyPoint){
                    if (POIList[val].storyPoint[p].storylineID == active_id){
                        //Updating sp
                        POIList[val].storyPoint[p].title = $("#spTitle").val();
                        POIList[val].ibeacon = $("#spBeaconID").val();
                        POIList[val].storyPoint[p].description = CKEDITOR.instances["editor1"].getData();
                        POIList[val].storyPoint[p].media = $("#attachedDocName").text();
						if($("#autoOn").attr("class") == "active"){
				            POIList[val].isAutoOn = true;
			            } else if($("#autoOff").attr("class") == "active") {
				            POIList[val].isAutoOn = false;
			            }
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
					/* if($("#autoOn").attr("class") === "btn btn-default active"){
				        newStoryPoint.isAutoOn = true;
			        } else if($("#autoOff").attr("class") === "btn btn-default active") {
				        newStoryPoint.isAutoOn = false;
			        } */
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
        highlightPOI(active_id);
    });
});
//Open editor of of point of a given id
function openEditorByPointID(id){
    for(val in POIList){
        if(POIList[val].ID === id){
            fillEditor(POIList[val]);
            break;
        }
    }
}

function fillEditor(poi){
    currentPOI = poi;
    var spFound = false;
    var spslExists = false;
    //If no storypoint for current active_id
    for(var p in currentPOI.storyPoint){
        if(currentPOI.storyPoint[p].storylineID == active_id){
            spslExists = true;
        }
    }

    if(!spslExists){
        if(poi.isSet){
            $("#spTitle").val(poi.title);
            $("#spBeaconID").val(poi.ibeacon);
            CKEDITOR.instances["editor1"].setData(poi.description);
            $("#attachedDocName").text(poi.media);
		    if(poi.isAutoOn === true){
			    $("#autoOn").click();
		    }else if(poi.isAutoOn === false){
			    $("#autoOff").click();
			}
        }
        else{
            $("#spTitle").val("");
            $("#autoOn").click();
            $("#spBeaconID").val("");
            CKEDITOR.instances["editor1"].setData("");
            $("#attachedDocName").text("");
        }
    }
    else{
        if(active_id !== -2){
            //find the storyPoint associated to the storyline
            for(var p in currentPOI.storyPoint){
                if (currentPOI.storyPoint[p].storylineID === active_id){
                    $("#spTitle").val(currentPOI.storyPoint[p].title);
					if(currentPOI.isAutoOn === true){
                        $("#autoOn").click();
					}else if(currentPOI.isAutoOn === false){
			            $("#autoOff").click();
			        }
                    $("#spBeaconID").val(currentPOI.ibeacon);
                    CKEDITOR.instances["editor1"].setData(currentPOI.storyPoint[p].description);
                    $("#attachedDocName").text(currentPOI.storyPoint[p].media);
                    spFound = true;
                }
            }
            //If the storyPoint doesnt exist, create it
            if(!spFound){
                $("#spTitle").val("");
                $("#autoOn").click();
                $("#spBeaconID").val("");
                CKEDITOR.instances["editor1"].setData("");
                $("#attachedDocName").text("");
                spFound = false;
            }
        }
    }
    //show the form
    setEditorTitle();
    $("#infoEditingForm").show();
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