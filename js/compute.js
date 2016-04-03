//Computations that are necessary throughtout the project

function distance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2));
}

function distanceSquared(p1, p2) {
    return Math.pow(p1.x - p2.x,2) + Math.pow(p1.y - p2.y,2);
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
        return edgePointArray(item); // Flatten the array of points included in the edge
    })), function(item) { return item === current; }); // Remove the current point

    // Get a list of edges that connect from the current point to another point that we haven't visited yet
    var validNeighbouringEdges = _.filter(edgeList,
        function(item) {
            var connectsToCurrent = _.contains(edgePointArray(item), current);
            var connectsToTraversed = (_.intersection(edgePointArray(item), traversedPoints)).length > 0;
            return connectsToCurrent && !connectsToTraversed;
        }
    );

    var foundPaths = [];

    for(var i = 0; i < validNeighbouringEdges.length; i++)
    {
        // If the edge connects to the target, add it to the path and add it to the list of found paths
        if(_.contains(edgePointArray(validNeighbouringEdges[i]), target))
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
            var nextPoint = (_.reject(edgePointArray(validNeighbouringEdges[i]), current))[0];
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

// Find the shortest path between two points
function findShortestPath(origin, destination) {

    // Find all the paths between the two points
    var paths = findPaths([], origin, destination);

    // If nothing found, return an empty path
    if(paths.length === 0)
    {
        return [];
    }

    var shortest = paths[0];
    var distSqu = _.reduce(_.map(shortest,
            // Calculate the squared distance between each of the edges
            function(item) { return distanceSquared(item.origin.point, item.destination.point); }),
            // Sum all the distances together
            function(memo, num) { return memo + num; }, 0);

    for(var i = 1; i < paths.length; i++)
    {
        var pathDistanceSquared = _.reduce(_.map(paths[i],
            // Calculate the squared distance between each of the edges
            function(item) { return distanceSquared(item.origin.point, item.destination.point); }),
            // Sum all the distances together
            function(memo, num) { return memo + num; }, 0);

        // If the distance is smaller, use it instead
        if(pathDistanceSquared < distSqu)
        {
            shortest = paths[i];
            distSqu = pathDistanceSquared;
        }
    }

    return shortest;
}

// Get an array of the points in the edge
function edgePointArray(edge) {
    return [edge.origin, edge.destination];
}

// Function for moving elements in an array
// Based off http://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
function moveInArray(array, old_index, new_index)
{
    while (old_index < 0) {
        old_index += array.length;
    }
    while (new_index < 0) {
        new_index += array.length;
    }
    if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array; // for testing purposes
}