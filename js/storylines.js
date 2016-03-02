
var current_id=0;
var active_id=-2;

function addNewStoryLine(){

    var name;
    name = $("#storylineField").val();
    if(name != false){
        var storyline = new Storyline();

        $("#StorylinesList").append('<li id="'+ current_id +'" onclick="storylineClicked(this)"><a href="#">'+ name +'</a></li>' +
        '<ul id="'+ current_id +'_pointList"></ul>');
        $("#StorylinesList").find(".active").removeClass("active");
        $("#"+current_id).addClass("active");
        active_id = current_id;
        storyline.ID = current_id;
        storyline.title.addPair('en', name);

        current_id++;
        $("#storylineField").val("");
        storylineList.push(storyline);
    }
    else{
        alert("Enter a name for the storyline.");
    }
}

//variable for active storyline id

function storylineClicked(elem){
    var id = $(elem).attr("id");
    $("#"+active_id).removeClass("active");
    $("#"+id).addClass("active");
    active_id = id;
};