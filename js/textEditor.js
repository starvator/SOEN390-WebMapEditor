$(document).ready(function(){
    $("#fakeStoryPoint").click(function(){
		CKEDITOR.instances["editor1"].setData($('#fakeStoryPointText').val());
		$("#textEditorDiv").show();
    });
});