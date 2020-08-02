﻿//// Constantes
const initmaprotation = 0; // -Math.PI / 8
const initmapviewcenter = ol.proj.fromLonLat([0, 0]); // default projection: EPSG:3857

//// Global variables
var source;

var overviewMapControl;
var displayCoordinatesControl;
var toggleGraticuleControl;
var mousePositionControl;
var displayUserCoordinatesControl;
var toggleFullscreenControl;
var scaleLineControl;
var centerOnUserPositionControl;
var lockOnUserPositionHeadingControl;
var startPauseRouteRecordControl;

var mapview;
var mapViewExtent;
var oseamaplayer;
var map;
var mpControl;
var graticule;
var mouseWheelZoomInteraction;

var zoomed = false;
var movestarted = false;

//// Managing user position layer
var userPositionIconStyle = new ol.style.Style({
    image: new ol.style.Icon({
        src: 'http://rendering/img/iconUserPosition.png',
        scale: 0.2,
        rotateWithView: true,
    })
});
var userPositionFeature = new ol.Feature({
    name: 'UserPosition',
    geometry: new ol.geom.Point(initmapviewcenter),
});
userPositionFeature.setStyle(userPositionIconStyle);
var userPositionSource = new ol.source.Vector({ // vectorsource 
    features: [userPositionFeature],
});
var userPositionVectorLayer = new ol.layer.Vector({ // vectorlayer
    source: userPositionSource,
});

// User position overview map layer
var userPositionIconStyleOM = new ol.style.Style({
    image: new ol.style.Icon({
        src: 'http://rendering/img/iconUserPosition.png',
        scale: 0.08,
        rotateWithView: true,
    })
});
var userPositionFeatureOM = new ol.Feature({
    name: 'UserPosition',
    geometry: new ol.geom.Point(initmapviewcenter),
});
userPositionFeatureOM.setStyle(userPositionIconStyleOM);
var userPositionSourceOM = new ol.source.Vector({ // vectorsource 
    features: [userPositionFeatureOM],
});
var userPositionVectorLayerOM = new ol.layer.Vector({ // vectorlayer
    source: userPositionSourceOM,
});


//// Managing route logging layer
// TODO (later) : manage multiple sources to still display previously logged route (and even GPX file routes ?)
// TODO (later) : select in a form with checkboxes which routes to display (and also a button to delete the route from display)
var loggingNewFeature;
var loggingValidity;

var routeStyles = {
    'Point': new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'rgba(255,0,0,0.4)'
            }),
            radius: 5,
            stroke: new ol.style.Stroke({
                color: 'red', // #ff0
                width: 1
            })
        })
    }),
    'LineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: '#f00',
            width: 3
        })
    }),
    'MultiLineString': new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green', // #0f0
            width: 3
        })
    })
};
var routeLoggingSource = new ol.source.Vector();
var routeLoggingVectorLayer = new ol.layer.Vector({
    source: routeLoggingSource,
    style: function (feature) {
        return routeStyles[feature.getGeometry().getType()];
    },
});

// DEBUG
var debugGPXSource = new ol.source.Vector({
    url: 'local://D/source/repos/OLTesting/_tests/balade.gpx',
    format: new ol.format.GPX(),
});
var debugGPXLayer = new ol.layer.Vector({
    source: debugGPXSource,
    style: function (feature) {
        return routeStyles[feature.getGeometry().getType()];
    },
});
var lobjectTest1 = new LObject("test1", true, routeLoggingVectorLayer);
var lobjectTest2 = new LObject("test2", false, debugGPXLayer);
var leonarWorkspace = [
    lobjectTest1,
    lobjectTest2
];
//console.log(JSON.stringify(leonarWorkspace)); // working

//// Popups/forms
var coordinates_container = document.getElementById('mouse-coordinates');
var coordinates_content = document.getElementById('mouse-coordinates-content');
var coordinates_closer = document.getElementById('mouse-coordinates-closer');
coordinates_closer.onclick = function () {
    coordinates_container.style.display = "none";
    return false;
};
dragElement(coordinates_container); // Make container dragable

var user_coordinates_container = document.getElementById('user-coordinates');
var user_coordinates_closer = document.getElementById('user-coordinates-closer');
user_coordinates_closer.onclick = function () {
    user_coordinates_container.style.display = "none";
    return false;
};
dragElement(user_coordinates_container); // Make container dragable

//// Functions
function init() {
    source = new ol.source.OSM();

    // Controls
    overviewMapControl = new ol.control.OverviewMap({
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [
            new ol.layer.Tile({
                source: source
            }),
            userPositionVectorLayerOM
        ],
        collapsed: true
    });
    displayCoordinatesControl = new app.DisplayCoordinates();
    toggleGraticuleControl = new app.ToggleGraticuleVisibility();
    displayUserCoordinatesControl = new app.DisplayUserCoordinates();
    toggleFullscreenControl = new app.ToggleFullscreen();
    centerOnUserPositionControl = new app.CenterOnUserPosition();
    lockOnUserPositionHeadingControl = new app.LockOnUserPositionHeading();
    startPauseRouteRecordControl = new app.StartPauseRouteRecord();

    scaleLineControl = new ol.control.ScaleLine({
        className: 'ol-scale-line',
        units: 'nautical',
        bar: false,
        steps: 4,
        text: false,
        minWidth: 140
    });

    // Views
    mapViewExtent = ol.proj.transformExtent([180, 90, -180, -90], 'EPSG:4326', 'EPSG:3857');
    mapview = new ol.View({
        maxZoom: 18,
        minZoom: 2,
        center: initmapviewcenter,
        rotation: initmaprotation,
        zoom: 10,
        multiWorld: true, // false
        // extent: mapViewExtent,
        constrainResolution: true,
    });

    // Layers
    oseamaplayer = new ol.layer.Tile({
        source: new ol.source.OSM({
            attributions: [
                '© <a href="http://www.openseamap.org/">OpenSeaMap</a>',
                ol.source.OSM.ATTRIBUTION
            ],
            opaque: false,
            url: 'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'
        })
    });

    graticule = new ol.layer.Graticule({
        strokeStyle: new ol.style.Stroke({
            color: 'rgba(255,120,0,0.9)',
            width: 2,
            lineDash: [0.5, 4]
        }),
        showLabels: true,
        wrapX: false
    });

    mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: function (coordinate) {
            return ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate), 0);
        },
        projection: 'EPSG:3857',
        className: 'coordinates-content',
        target: coordinates_content,
        undefinedHTML: '&nbsp;'
    });

    // Interactions
    mouseWheelZoomInteraction = new ol.interaction.MouseWheelZoom({
        useAnchor: true,
    });

    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: source
            }),
            oseamaplayer,
            graticule,
            userPositionVectorLayer,
            routeLoggingVectorLayer,
            debugGPXLayer
        ],
        controls: ol.control.defaults({ attribution: false }).extend([
            new ol.control.ZoomSlider(),
            overviewMapControl,
            centerOnUserPositionControl,
            displayCoordinatesControl,
            toggleGraticuleControl,
            mousePositionControl,
            displayUserCoordinatesControl,
            toggleFullscreenControl,
            scaleLineControl,
            lockOnUserPositionHeadingControl,
            startPauseRouteRecordControl
        ]),
        interactions: ol.interaction.defaults().extend([
            new ol.interaction.DragRotateAndZoom(),
            mouseWheelZoomInteraction
        ]),
        view: mapview,
    });

    // update user feature (before update map rotation)
    updateUserPositionFeature(userPositionFeature);
    updateUserPositionFeature(userPositionFeatureOM);

    // set map center to initial user position and heading
    centerMapOnUserPosition(map);
    // rotateMapToHeading(map); // working but temporary (cf. call only in heading locked mode)

    // update user data
    updateUserData();

    // attach events
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 112) { // F1
            togglePopupDisplay(user_coordinates_container, 'displayUserCoordinates');
        } else if (event.keyCode == 27) { // Escape
            toggleFullscreenHelper();
        }
    });

    mapview.on('change:resolution', function () { // detect when zooming in/out
        if (map.getView().getZoom() % 1 == 0) {
            zoomed = true;
        }
    });

    // TODO : improve reset management to ensure that everything remains locked (even when zooming in/out) unless user is moving
    // TODO : problem, change:resolution occurs after move start
    map.on("movestart", function () {
        movestarted = true;
    });

    map.on("moveend", function () {
        movestarted = false;

        if ((!map.calledCenterMapOnUserPosition && !map.calledRotateMapToHeading) && !zoomed) {
            centerOnUserPositionControl.activeBool = false;
            lockOnUserPositionHeadingControl.activeBool = false;

            // set use anchor in mouse wheel interaction to disable forced zoom on map center = user position
            map.getInteractions().forEach(function (interaction) {
                if (interaction instanceof ol.interaction.MouseWheelZoom) {
                    interaction.setMouseAnchor(true);
                }
            });
        }

        zoomed = false;
    });

    map.on("postrender", function () {
        if (map.calledCenterMapOnUserPosition) { // reset calling state
            map.calledCenterMapOnUserPosition = false;
        }
        if (map.calledRotateMapToHeading) { // reset calling state
            map.calledRotateMapToHeading = false;
        }
    });
}

var previousPosition;
var currentPosition;

// Loop function called from VB code
function loop() {
    // update validity
    loggingValidity = getValidity();

    // Update user coordinates, heading and speed displays
    updateUserData();

    // Update user position feature coordinates and heading
    updateUserPositionFeature(userPositionFeature);
    updateUserPositionFeature(userPositionFeatureOM);

    // Center to user position if active
    if (centerOnUserPositionControl.activeBool && !movestarted) { // do not force centering when a motion has started
        centerMapOnUserPosition(map);
    }

    // Update map center and rotation if in heading-locked mode
    if (lockOnUserPositionHeadingControl.activeBool && !movestarted) { // do not force rotating when a motion has started
        centerMapOnUserPosition(map);
        rotateMapToHeading(map);
    }

    // Log to route if active
    if (startPauseRouteRecordControl.activeBool && loggingValidity) {
        // create feature point at user position
        previousPosition = currentPosition;
        currentPosition = getUserPosition();

        // creating features
        if (previousPosition != undefined && currentPosition != undefined) {
            loggingNewFeature = new ol.Feature({
                name: 'loggedRoute',
                geometry: new ol.geom.LineString([
                    ol.proj.fromLonLat([previousPosition._longitude, previousPosition._latitude]),
                    ol.proj.fromLonLat([currentPosition._longitude, currentPosition._latitude])
                ]),
            });
            routeLoggingSource.addFeature(loggingNewFeature);
        }
    } else {
        // reset previous position and current position
        previousPosition = undefined;
        currentPosition = undefined;
    }
}

//// Main
init();