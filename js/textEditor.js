$(document).ready(function(){
    //The open button
    $("#fakeStoryPoint").click(function(){
		CKEDITOR.instances["editor1"].setData($('#fakeStoryPointText').val());
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
        //if you click cancel in a dialog, it will clear the input, so clear the field
        catch (e){
            $("#attachedDocName").text("");
        }
    });
    
});