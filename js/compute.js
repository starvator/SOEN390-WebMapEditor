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

// Find all the possible list of non-looping edges to get from one point to the next
function findPaths(traversed, current, target)
{
    // Get a list of all the points traversed so far
    var traversedPoints = _.reject(_.flatten(_.map(traversed, function(item) {
        return item.pointCollection(); // Flatten the array of points included in the edge
    })), function(item) { return item === current; }); // Remove the current point

    // Get a list of edges that connect from the current point to another point that we haven't visited yet
    var validNeighbouringEdges = _.filter(edgeList,
        function(item) {
            var connectsToCurrent = _.contains(item.pointCollection(), current);
            var connectsToTraversed = (_.intersection(item.pointCollection(), traversedPoints)).length > 0;
            return connectsToCurrent && !connectsToTraversed;
        }
    );

    var foundPaths = [];

    for(var i = 0; i < validNeighbouringEdges.length; i++)
    {
        // If the edge connects to the target, add it to the path and add it to the list of found paths
        if(_.contains(validNeighbouringEdges[i].pointCollection(), target))
        {
            var goodPath = traversed.slice();
            goodPath.push(validNeighbouringEdges[i])
            foundPaths.push(goodPath);
        }
        else
        {
            // Continue the search for the target
            var pendingPath = traversed.slice();
            pendingPath.push(validNeighbouringEdges[i]);
            var nextPoint = (_.reject(validNeighbouringEdges[i].pointCollection(), current))[0];
            var newPaths = findPaths(pendingPath, nextPoint, target);
            for(var j = 0; j < newPaths.length; j++)
            {
                // Add any found paths to the list of found paths
                foundPaths.push(newPaths[j]);
            }
        }
    }

    return foundPaths;
}