
var current_id=0;
var active_id=-2;

function addNewStoryLine(){

    var name;
	var description;
    name = $("#storylineField").val();
	description = $("#storylineDescription").val();
    if(name != false){
        var storyline = new Storyline();
		if(description != false){
		$("#StorylinesList").append('<li id="'+ current_id +'" onclick="storylineClicked(this)"><a href="#">'+ name +'</br>' + description +'</a></li>' +
        '<ul id="'+ current_id +'_pointList"></ul>');
		}
		else{
        $("#StorylinesList").append('<li id="'+ current_id +'" onclick="storylineClicked(this)"><a href="#">'+ name +'</a></li>' +
        '<ul id="'+ current_id +'_pointList"></ul>');
		}
        $("#StorylinesList").find(".active").removeClass("active");
        $("#"+current_id).addClass("active");
        active_id = current_id;
        storyline.ID = current_id;
        storyline.title.addPair('en', name);
		storyline.description.addPair('en', description);

        current_id++;
        $("#storylineField").val("");
		$("#storylineDescription").val("");
        storylineList.push(storyline);
    }
    else{
        alert("Enter a name for the storyline.");
    }
}

function editStoryLine(){

	var storyline;
	for(var i = 0; i < storylineList.length; i++)
	{
		if(storylineList[i].ID == active_id)
		{
			storyline = storylineList[i];
		}
	}
	$("#"+active_id).html('<a><input id="storylineField" type="text" placeholder="Edit Title" value="' + storyline.title.getByLanguage("en") +'"/></br><input id="storylineDescription" type="text" placeholder="Edit Description" value="' + storyline.description.getByLanguage("en") +'" /></a>');
	$("#editButton").html('<a href="#">Save</a>');
	$("#editButton").attr("onclick","saveStoryLine()");
}

function saveStoryLine(){
	
	var name;
	var description;
	var storyline;
	for(var i = 0; i < storylineList.length; i++)
	{
		if(storylineList[i].ID == active_id)
		{
			storyline = storylineList[i];
		}
	}
	name = $("#storylineField").val();
	description = $("#storylineDescription").val();
	$("#"+active_id).html('<a href="#">'+ name +'</br>' + description +'</a>');
	storyline.title.setByLanguage("en", name);
	storyline.description.setByLanguage("en", description);
	$("#storylineField").val("");
	$("#storylineDescription").val("");
	$("#editButton").html('<a href="#">Edit</a>');
	$("#editButton").attr("onclick","editStoryLine()");
}

//variable for active storyline id

function storylineClicked(elem){
    var id = $(elem).attr("id");
    $("#"+active_id).removeClass("active");
    $("#"+id).addClass("active");
    active_id = id;
};