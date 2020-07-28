﻿// Adding properties to Map class to store calling functions
ol.control.Control.prototype.calledCenterMapOnUserPosition = false;
ol.control.Control.prototype.calledRotateMapToHeading = false;

//// Map helpers
function getUserPosition() {
    var coordinates = winformObj.getUserPosition();
    var userposition = JSON.parse(coordinates);
    return userposition;
}

function getUserHeading() {
    var heading = winformObj.getUserHeading();
    var userheading = JSON.parse(heading);
    return userheading;
}

function getUserSpeed() {
    var speed = winformObj.getUserSpeed();
    var userspeed = JSON.parse(speed);
    return userspeed;
}

function getValidity() {
    var validity = winformObj.getValidity();
    var rmcvalidity = JSON.parse(validity);
    return rmcvalidity;
}

function centerMapOnCoordinates(map, lat, lon) {
    map.getView().setCenter(ol.proj.fromLonLat([lon, lat]));
}

function rotateMapByAngleDegrees(map, angle) {
    map.getView().setRotation(- angle * Math.PI / 180);
}

function centerMapOnUserPosition(map) {
    map.calledCenterMapOnUserPosition = true;
    var userposition = getUserPosition();
    centerMapOnCoordinates(map, userposition._latitude, userposition._longitude)
}

function rotateMapToHeading(map) {
    map.calledRotateMapToHeading = true;
    var userheading = getUserHeading();
    rotateMapByAngleDegrees(map, userheading);
}

function togglePopupDisplay(popup_container, element_id) {
    var element = document.getElementById(element_id);

    if (popup_container.style.display == "block") {
        popup_container.style.display = "none";

        // set control class as inactive
        element.classList.remove('custom-control-active');
    } else {
        popup_container.style.display = "block";

        // set control class as active
        element.classList.add('custom-control-active');
    }
}

function toggleFullscreenHelper() {
    // call VB NET function
    winformObj.toggleFormMainFullscreen();

    // toggle control display
    var element = document.getElementById('toggleFullscreen');
    element.classList.toggle('custom-control-active');
}

function updateUserData() {
    var userposition = getUserPosition();
    var userheading = getUserHeading();
    var userspeed = getUserSpeed();

    var coordinates_content = document.getElementById('user-coordinates-content');
    var heading_content = document.getElementById('user-heading-content');
    var speed_content = document.getElementById('user-speed-content');

    coordinates_content.innerHTML = ol.coordinate.toStringHDMS([userposition._longitude, userposition._latitude], 0);
    speed_content.innerHTML = userspeed.toFixed(2) + " kts";
    heading_content.innerHTML = userheading.toFixed(0) + "°";

    //  make content blinking if RMC messages are not valid
    if (getValidity() == false) {
        coordinates_content.classList.add('blinking-content');
        heading_content.classList.add('blinking-content');
        speed_content.classList.add('blinking-content');
    } else {
        coordinates_content.classList.remove('blinking-content');
        heading_content.classList.remove('blinking-content');
        speed_content.classList.remove('blinking-content');
    }
}

function updateUserPositionFeature(feature) {
    var userposition = getUserPosition();
    var userheading = getUserHeading();

    feature.getGeometry().setCoordinates(ol.proj.fromLonLat([userposition._longitude, userposition._latitude]));
    feature.getStyle().getImage().setRotation(userheading * Math.PI / 180, ol.proj.fromLonLat([userposition._longitude, userposition._latitude]));
}

//// Openlayers extensions
var ol_ext_inherits = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};

//// Dragable element
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // constraining motion (not robust to resizing)
        var top = Math.max(0, (elmnt.offsetTop - pos2));
        if (top + elmnt.offsetHeight > window.innerHeight) {
            top = elmnt.offsetTop
        }

        var left = Math.max(0, (elmnt.offsetLeft - pos1));
        if (left + elmnt.offsetWidth > window.innerWidth) {
            left = elmnt.offsetLeft
        }

        elmnt.style.top = top + "px";
        elmnt.style.left = left + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}