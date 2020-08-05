[X] 16/07/2020 : create custom control displaying a collapsable form showing coordinates similar to this https://geoservices.ign.fr/documentation/exemples/ol-control-mousePosition.html
and update displayed coordinates on mouse move
[X] 17/07/2020 : dragable popup for mouse coordinates (will be reproduced for other forms :)
[X] 17/07/2020 : display userposition coordinates / speed and heading in a popup (display blinking exclamation dot if no signal, display 1 icon by line)
[X] 18/07/2020 : JS to toggle fullscreen (call VB NET function)
[X] 19/07/2020 : limit east/west map extent
[X] 19/07/2020 : display feature (or Overlay ?) (point) at user position (ship icon), and rotate following heading [STARTED, develop specific function to move and rotate userPositionFeature]
[X] 19/07/2020 : cache implementation (check this is actually working in case of disconnection or nomadism with no internet) --> seems to be working ok
[X] 20/07/2020 : show NM scale (https://openlayers.org/en/latest/examples/scale-line.html), https://openlayers.org/en/latest/apidoc/module-ol_control_ScaleLine-ScaleLine.html, use classname to position appropriately
[X] XX/XX/XXXX : add class to change control toolbar background when underlying functionality is active (form opened for example)
[X] XX/XX/XXXX : press escape when fullscreen is toggled to exit fullscreen (actually also used to enter fullscreen ...)
[X] XX/XX/XXXX : reimplement VB.NET GPS management (1s thread)
[X] XX/XX/XXXX : bug in NMEA parser on longitude if longitude is integer (probably same bug on latitude if integer ???)
[X] XX/XX/XXXX : update JSInterface object on GPS data serial update <-- do this before anything else for easy debugging
[X] 22/07/2020 : lock on user position
[X] 22/07/2020 : when locked on user position, do not zoom to user pointer but to user position
[X] XX/XX/XXXX : work on loop function
[X] XX/XX/XXXX : lock on user heading control (when locking, also lock user position, unlock as soon as user moves)
[X] XX/XX/XXXX : also display user position feature (point) on small map (adding userPositionVectorLayer to layers would work but icon appears too big, display same icon but smaller)
[X] XX/XX/XXXX : do not log if RMC messages are not valid (should be ok now)
[X] XX/XX/XXXX : implement route logging (+ route/features? listing form and GPX and/or GeoJSON export option)


1) Implement layer interaction (with one layer, loaded from GPX), interact with all possible data (speed and heading, etc)
--> pour les formats GPX d'autres applications, juste récupérer les données sans chercher à savoir ce qu'elles représentent (et les afficher)
--> pour les formats issus de LeONAR, correctement les prendre en charge :)
2) Implement multiple layers management (or other way to manage different tracks)
3) Implement multiple layers interaction (interacting with only one at a time)
4) Implement layer creation from GPX file loading
5) Implement layer creation from GPS receiver, find a way to store all possible data (speed and heading)

XX/XX/XXXX : vectorlayer, show tooltip with data when mouse goes over layer features, issued from GPX or receiver (time, coordinates, deltaTime with start, distance to start, distance to arrival, speed, heading)
LObject : how to save speed data ??
XX/XX/XXXX : display position precision circle when GPS data is valid
XX/XX/XXXX : implement saving leonarWorkspace (array of LObjects) to JSON
[STARTED] XX/XX/XXXX : implement loading GPX file to LObject (and load speed data)
XX/XX/XXXX : implement loading LObjects array JSON to leonarWorkspace
XX/XX/XXXX : route logging GPX/GeoJSON export/import (export from VB code not from JS features ?)
XX/XX/XXXX : multiple routes management (form+html list)
--> create a LObject class incorporating features (which will be rendered in loop if LObject is shown)
--> https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Classes
XX/XX/XXXX : LObject export to XML or JSON (https://developer.mozilla.org/en-US/docs/Web/Guide/Parsing_and_serializing_XML)
https://stackoverflow.com/questions/40201589/serializing-an-es6-class-object-as-json
https://developer.mozilla.org/fr/docs/Learn/JavaScript/Objects/JSON


XX/XX/XXXX : user layer features selection (just respond to mouse hover?) and information display in specific popup (feature type, coordinates at the least if point) (https://openlayers.org/en/latest/examples/select-features.html ?)
XX/XX/XXXX : GeoJSON features file export/load (from user layer(s))
XX/XX/XXXX : GPX/GeoJSON waypoint/track/route export/import

XX/XX/XXXX : NM and heading rule tool with both ends movable by user and can be snapped to/from any other feature (Problems probably to be encountered: how to disable map motion when moving feature and allow it when not selectiong feature?)
XX/XX/XXXX : NM and heading rule route tool (multiple segments possible to anticipate route)


XX/XX/XXXX : loading splash screen while waiting for cefsharp to be active?


Bugs :
[SOLVED] when on lower zooms, centering to location near the edges of the "map" does not work since map is not authorized to move out of the planisphere (correction should be easy by allowing multiple worlds and deleting map extent ...)
- when restarting app but antenna continued storing data in the COM buffer the whole data is read again (and not the latest), or is it only a bug linked to GPS simulator ?
- when closing form popup using top right close cross, this does not change control status (stays greyed out as if activated)

Controls to add: Quit application (especially when fullscreen), Lock on user heading (rotating map ...)/Unlock from user heading (get back north up map)




1) Cache (openlayers local storage)
2) OLObject to GEOJson and display on custom layer https://openlayers.org/workshop/en/vector/geojson.html
3) Display mouse position on map (in personalized control?) https://openlayers.org/en/latest/examples/mouse-position.html?q=control
4) Shortcut to collapse overview map
5) Shortcut to center on user position
6) Logging control (and data management)
7) GRIB layer
8) Currents layer
9) Time forward/backward controls


>>> Save format could be GeoJSON <<<

==== Versions ====
Openlayers V6.4.3

==== Resources ====
https://commons.wikimedia.org/wiki/Farm-Fresh_web_icons