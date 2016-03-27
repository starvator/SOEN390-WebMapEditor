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
    contextTraversed.push(current);
    
    var neighbours = _.flatten(_.map(_.filter(edgeList, 
        function(item) {return item.origin === current || item.destination === current; }),
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
    
    var foundPaths = [];
    
    for(var i = 0; i < neighbours.length; i++)
    {
        if(neighbours[i] ===  target)
        {
            var goodPath = contextTraversed.slice();
            goodPath.push(neighbours[i])
            foundPaths.push(goodPath);
        }
        else
        {
            var newPaths = findPaths(contextTraversed, neighbours[i], target);
            for(var j = 0; j < newPaths.length; j++)
            {
                foundPaths.push(newPaths[j]);
            }
        }
    }
    
    return foundPaths;
}