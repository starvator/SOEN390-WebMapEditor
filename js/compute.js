//Computations that are necessary throughtout the project

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2));
}

//Credit to Matej Pokorny and mikemaccana for assistance
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

var myvount = 0;

function findPaths(traversed, current, target)
{
    myvount++;
    
    var contextTraversed = traversed.slice();
    
    /*
    contextTraversed.push(current);
    
    var neighbours = _.flatten(_.map(_.filter(edgeList, 
        function(item) {return (item.origin === current || item.destination === current); }),
        function(item) {
            var out = [];
            
            if(!_.contains(contextTraversed, item.origin))
            {
                out.push(item.origin);
            }
            
            if(!_.contains(contextTraversed, item.destination))
            {
                out.push(item.destination);
            }
            
            return out;
        }
    ));
    */
    
    var traversedPoints = _.reject(_.flatten(_.map(contextTraversed, function(item) {
        return item.pointCollection();
    })), function(item) { return item === current; });
            
    var validNeighbouringEdges = _.filter(edgeList, 
        function(item) {
            var connectsToCurrent = _.contains(item.pointCollection(), current);
            var connectsToTraversed = (_.intersection(item.pointCollection(), traversedPoints)).length > 0;
            return connectsToCurrent && !connectsToTraversed;            
        }
    );
    
    //contextTraversed.push(current);
    
    var foundPaths = [];
    
    for(var i = 0; i < validNeighbouringEdges.length; i++)
    {
        if(_.contains(validNeighbouringEdges[i].pointCollection(), target))
        {
            var goodPath = contextTraversed.slice();
            goodPath.push(validNeighbouringEdges[i])
            foundPaths.push(goodPath);
        }
        else
        {
            var pendingPath = contextTraversed.slice();
            pendingPath.push(validNeighbouringEdges[i]);
            var nextPoint = (_.reject(validNeighbouringEdges[i].pointCollection(), current))[0];
            var newPaths = findPaths(pendingPath, nextPoint, target);
            for(var j = 0; j < newPaths.length; j++)
            {
                foundPaths.push(newPaths[j]);
            }
        }
    }
    
    return foundPaths;
}