$(document).ready(function(){
    //The open button
    $("#fakeStoryPoint").click(function(){  
        
        //fill the info
        $("#spTitle").val("Title");
        $("#autoOn").click();
        //$("#autoOff").click();
        $("#spBeaconID").val("beacon id");     
		CKEDITOR.instances["editor1"].setData("<p>the info that i<strong>s &quot;&quot;in the js<u>on</u></strong><u> whateve</u>r</p>");
        $("#attachedDocName").text("Oldfilename.txt");
        
        //show the form
		$("#infoEditingForm").show();
    });
    
    //The x
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
    
});