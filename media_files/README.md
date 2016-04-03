# SOEN390-WebMapEditor
Project for 390, to make an online map editor for the museum


----------


The editor should be developed in pure JavaScript (server-side scripting languages, such as PHP, JSP, Java servlets, ASP.net are not allowed) and should run in a web browser.

1.	Load floor plans from SVG images or PDF files (the floor plan serves as an underlay to help the user enter data points in the appropriate locations)
  1.  Each floor plan will be associated with a unique ID (the floor number)
  2.  The user can import multiple floor plans
  3.  The user should have the option to switch between different imported floor plans and resume his/her previous work
2.	Add data points on a floor plan
  1.	The user can define two kinds of nodes on a floor plan: i) points of interest, such as exhibitions/collections usually placed inside rooms, washrooms and ii) points of transition, which are used to connect points of interest, and are usually placed on the corridors connecting the rooms. Points of transition can also be stairs and elevators connecting two different floors, and ramps.
  2.	The user can also create edges between two points. Every edge should be a path that can be traversed by a museum visitor. This means that the edges should not cross room walls, but they can cross room doors. Each edge has a weight representing the distance between the two points it connects.
  3.	All points along with the edges drawn by the user should always form a connected graph. This means that there should not exist unreachable points.
  4.	A point of interest can have additional information, such as HTML formatted-text, audio files, image files, video files, iBeacon info, and URLs. The entered information can be previewed in a tooltip, whenever the user hovers over a point of interest.
3.	Create storylines
  1.	A storyline is an ordered list of points. It can include both points of interest and points of transition, and it should include at least one point of interest. A certain point in a storyline can be revisited (traversed more than once). A storyline can include points from different floors. A story line always forms a connected graph (it cannot contain unreachable points).
  2.	The user can create a story line by dragging the mouse over existing points. The story line should be drawn as the mouse is dragged.
  3.	Each story line should have a different color. A panel should exist showing all created storylines. In this panel, the user can hide (disable) and show (enable) each storyline on the map. The panel should have also the options to hide all and show all storylines.
4.	Export Path graph and storylines
  1.	All data points (along with their associated meta-information), edges connecting the data points (along with their weights), and the storylines, should be exported in JSON format.
  2.	The JSON file should be imported to allow the user to resume his/her previous work. After importing the data points, edges, and storylines should appear on the floor plans.