var currentPOIID;
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
        //store the info
        //alert($("#spTitle").val());
        //alert($("input[name=autoTrig]:checked").val());
		//alert($("#spBeaconID").val());     
		//alert(CKEDITOR.instances["editor1"].getData());
        //alert($("#attachedDocName").text());
        
		for(val in POIList){
		if(POIList[val].ID == currentPOIID){
			POIList[val].title = $("#spTitle").val();
			POIList[val].ibeacon = $("#spBeaconID").val();
			POIList[val].description = CKEDITOR.instances["editor1"].getData();
			POIList[val].media = $("#attachedDocName").text();
			POIList[val].storypoint.push(active_id);
			
			//Adding the point to the storyline list.
			if(POIList[val].isSet){
				//get into <a> and change POIList[val].title
				$("#"+POIList[val].ID+"_a").text(POIList[val].title);
			}
			else{
				$("#"+active_id+"_pointList").append('<li><a id = "' + POIList[val].ID + '_a"onClick = "openEditorByPointID('+ POIList[val].ID +')">'+ POIList[val].title +'</a></li>');	
				POIList[val].isSet = true;
			}
			break;
		}
	}
        
        //close the window
        $("#infoEditingForm").hide();
    });
});
//Open editor of of point of a given id
function openEditorByPointID(id){
	for(val in POIList){
		if(POIList[val].ID == id){
			fillEditor(POIList[val]);
			break;
		}
	}
}

function fillEditor(poi){
	currentPOIID = poi.ID;
    //fill the info
	if(poi.isSet){
		$("#spTitle").val(poi.title);
		$("#autoOn").click();
		//$("#autoOff").click();
		$("#spBeaconID").val(poi.ibeacon);     
		CKEDITOR.instances["editor1"].setData(poi.description);
		$("#attachedDocName").text(poi.media);
	}
	else{
		$("#spTitle").val("Title");
		$("#autoOn").click();
		//$("#autoOff").click();
		$("#spBeaconID").val("beacon id");     
		CKEDITOR.instances["editor1"].setData("<p>the info that i<strong>s &quot;&quot;in the js<u>on</u></strong><u> whateve</u>r</p>");
		$("#attachedDocName").text("Oldfilename.txt");
	}
    //show the form
	$("#infoEditingForm").show();
}