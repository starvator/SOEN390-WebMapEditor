
var current_id=0;
var active_id=-2; // -2 is poi creating

function addNewStoryLine(){

    var name;
    var description;
    name = $("#storylineField").val();
    description = $("#storylineDescription").val();
    if(name){
        var storyline = new Storyline();
        if(description){
        $("#StorylinesList").append('<li id="'+ current_id +'" onclick="storylineClicked(this)"><a href="#">'+ name +'</br>' + description +'</a></li>' +
        '<ul id="'+ current_id +'_pointList" class="list-group"></ul>');
        }
        else{
        $("#StorylinesList").append('<li id="'+ current_id +'" onclick="storylineClicked(this)"><a href="#">'+ name +'</a></li>' +
        '<ul id="'+ current_id +'_pointList" class="list-group"></ul>');
        }
        $("#StorylinesList").find(".active").removeClass("active");
        $("#"+current_id).addClass("active");
        active_id = current_id;
        storyline.ID = current_id;

        storyline.title[currentLanguage] = name;
        storyline.description[currentLanguage] = description;
        /** TODO LanguageText Story
        storyline.title.addPair('en', name);
        storyline.floorsCovered.push(current_floor);
        storyline.description.addPair('en', description);
        **/

        $("#storylineField").val("");
        $("#storylineDescription").val("");
        storylineList.push(storyline);
        storylineClicked($("#"+current_id));
        current_id++;
        
        // Add a sortable list to the storyline so that we can re-arrange storypoints
        addSortableToStoryline(storyline);
    }
    else{
        showWarningAlert("Enter a name for the storyline.");
    }
}

function buildStorylineMenuFromList(){
    jQuery.each(storylineList, function(i, s){
        if(s.description[currentLanguage]){
        $("#StorylinesList").append('<li id="'+ s.ID +'" onclick="storylineClicked(this)"><a href="#">'+ s.title[currentLanguage] +'</br>' + s.description[currentLanguage] +'</a></li>' +
        '<ul id="'+ s.ID +'_pointList" class="list-group"></ul>');
        }
        else{
        $("#StorylinesList").append('<li id="'+ s.ID +'" onclick="storylineClicked(this)"><a href="#">'+ s.title[currentLanguage] +'</a></li>' +
        '<ul id="'+ s.ID +'_pointList" class="list-group"></ul>');
        }
        
        
        
        current_id++;

        $.each(POIList, function(i, poi) {
                $.each(poi.storyPoint, function(j, sp) {
                    if(sp.storylineID == s.ID) {
                        $("#"+s.ID+"_pointList").append('<li class="draggable_story_point list-group-item"><span class="glyphicon glyphicon-menu-hamburger" aria-hidden="true"><a id = "' + sp.ID + '_a"onClick = "openEditorByPointID('+ sp.ID +')">'+ sp.title[currentLanguage] +'</a></li>');
                    }
                });
            });
        
        // Add a sortable list to the storyline so that we can re-arrange storypoints
        addSortableToStoryline(s);
    });
}

function addSortableToStoryline(storyline)
{
    var sorter = document.getElementById(storyline.ID+"_pointList");
    Sortable.create(sorter, {
        draggable:".draggable_story_point",
        handle:".glyphicon-menu-hamburger",
        animation: 150,        
        onEnd: function (/**Event*/evt) {
            handleStorypointRearrange(storyline, evt.oldIndex, evt.newIndex);
        }
    });
}

// Move a storypoint and re-highlight edges
function handleStorypointRearrange(storyline, oldIndex, newIndex)
{
    moveInArray(storyline.path, oldIndex, newIndex);
    highlightEdges();
}

function editStoryLine(){

    var storyline;
    for(var i in storylineList)
    {
        if(storylineList[i].ID == active_id)
        {
            storyline = storylineList[i];
        }
    }
    $("#"+active_id).html('<a><input id="storylineField" type="text" placeholder="Edit Title" value="' + storyline.title[currentLanguage] +'"/></br><input id="storylineDescription" type="text" placeholder="Edit Description" value="' + storyline.description[currentLanguage] +'" /></a>');
    $("#submitButton").hide();
    $("#editButton").html('<a href="#">Save Changes</a>');
    $("#editButton").attr("onclick","saveStoryLine()");
    $('#deleteStorylineButton').addClass("hidden");
    $('#storylineFormInfo').addClass("hidden");
    hideEntireInactiveStoryLines();
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
    storyline.title[currentLanguage] = name;//.setByLanguage("en", name);
    storyline.description[currentLanguage] = description;//.setByLanguage("en", description);
    $("#storylineField").val("");
    $("#storylineDescription").val("");
    $("#editButton").html('<a href="#">Edit Active Storyline</a>');
    $("#editButton").attr("onclick","editStoryLine()");
    $('#deleteStorylineButton').removeClass("hidden");
    $('#storylineFormInfo').removeClass("hidden");
    $("#submitButton").show();
    showEntireInactiveStoryLines();
}

//variable for active storyline id

function storylineClicked(elem){
    var id = $(elem).attr("id");
    $("#"+active_id).removeClass("active");
    $("#"+id).addClass("active");
    $("#editPOIButton").removeClass("active");
    active_id = id;
    highlightPOI(active_id);
    hideInactiveStoryLines();
    $('#activeButtonsList').removeClass("hidden");
    redraw();
};

function hideInactiveStoryLines(){
    //all id except up to current except acctive 0_pointList
    for(var id = 0; id < current_id; id++){
        if(id != active_id){
            $("#"+id+"_pointList").hide();
        }
        if(id == active_id){
            $("#"+id+"_pointList").show();
        }
    }
};

function hideEntireInactiveStoryLines(){
    //all id except up to current except acctive 0_pointList
    for(var id = 0; id < current_id; id++){
        if(id != active_id){
            $("#"+id).hide();
            $("#"+id+"_pointList").hide();
        }
        if(id == active_id){
            $("#"+id).show();
            $("#"+id+"_pointList").show();
        }
    }
};

function showEntireInactiveStoryLines(){
    //all id except up to current except acctive 0_pointList
    for(var id = 0; id < current_id; id++){
        if(id != active_id){
            $("#"+id).show();
            $("#"+id+"_pointList").hide();
        }
        if(id == active_id){
            $("#"+id).show();
            $("#"+id+"_pointList").show();
        }
    }
};

function findFloorsCovered(storyline){
    var duplicate;
    for(var i = 0; i < storyline.path.length; i++)
    {
        var loopPOI;
        for(var j = 0; j < POIList.length; j++)
        {
            if(POIList[j].ID === storyline.path[i])
            {
                loopPOI = POIList[j];
            }
        }
        duplicate = false;
        for(var floor = 0; floor < storyline.floorsCovered.length; floor++)
        {
            if(loopPOI.floorID === storyline.floorsCovered[floor])
            {
                duplicate = true;
                break;
            }
        }
        if(!duplicate)
        {
            storyline.floorsCovered.push(loopPOI.floorID)
        }
    }
}