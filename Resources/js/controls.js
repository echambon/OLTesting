window.app = {};
var app = window.app;

// TODO: control to toggle keep North up / follow user position heading
// TODO: toggle keep centered on user position
// TODO: toggle back to false as soon as moving map

// Adding properties to Control class to store additional data
ol.control.Control.prototype.activeBool = false;

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.CenterOnUserPosition = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconShip.png /><span class="tooltiptext">Center on position</span></div>';

    var this_ = this;
    var centerOnUserPosition = function (e) {
        centerMapOnUserPosition(this_.getMap());

        // Boolean used to store status: if true then map is kept centered on user position, reset to false once map has been moved
        this_.activeBool = true;

        // set use anchor in mouse wheel interaction to force zooming on map center = user position
        this_.getMap().getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.MouseWheelZoom) {
                interaction.setMouseAnchor(false);
            }
        });
    };

    button.addEventListener('click', centerOnUserPosition, false);
    button.addEventListener('touchstart', centerOnUserPosition, false);

    var element = document.createElement('div');
    element.className = 'center-on-user-position-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.CenterOnUserPosition, ol.control.Control);

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.LockOnUserPositionHeading = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconHeading.png /><span class="tooltiptext">Lock on position/heading</span></div>';

    var this_ = this;
    var lockOnUserPositionHeading = function (e) {
        centerMapOnUserPosition(this_.getMap());
        rotateMapToHeading(this_.getMap());

        // Boolean used to store status
        this_.activeBool = true;

        // set use anchor in mouse wheel interaction to force zooming on map center = user position
        this_.getMap().getInteractions().forEach(function (interaction) {
            if (interaction instanceof ol.interaction.MouseWheelZoom) {
                interaction.setMouseAnchor(false);
            }
        });
    };

    button.addEventListener('click', lockOnUserPositionHeading, false);
    button.addEventListener('touchstart', lockOnUserPositionHeading, false);

    var element = document.createElement('div');
    element.className = 'lock-on-user-position-heading-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.LockOnUserPositionHeading, ol.control.Control);

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.DisplayCoordinates = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconMouse.png /><span class="tooltiptext">Mouse coordinates</span></div>';
    var coordinates_container = document.getElementById('mouse-coordinates');

    var this_ = this;
    var showCoordinatesPopup = function (e) {
        togglePopupDisplay(coordinates_container,'displayCoordinates');
    };

    button.addEventListener('click', showCoordinatesPopup, false);
    button.addEventListener('touchstart', showCoordinatesPopup, false);

    var element = document.createElement('div');
    element.id = 'displayCoordinates';
    element.className = 'display-coordinates-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.DisplayCoordinates, ol.control.Control);

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.ToggleGraticuleVisibility = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconGraticule.png /><span class="tooltiptext">Toggle graticule</span></div>';

    var this_ = this;
    var toggleVisibility = function (e) {
        var element = document.getElementById('toggleGraticuleVisibility');
        var layers = this_.getMap().getLayers();
        var graticuleLayer = layers.item(2);
        if (graticuleLayer.getVisible() == true) {
            graticuleLayer.setVisible(false);
            element.classList.remove('custom-control-active');
        } else {
            graticuleLayer.setVisible(true);
            element.classList.add('custom-control-active');
        }
    };

    button.addEventListener('click', toggleVisibility, false);
    button.addEventListener('touchstart', toggleVisibility, false);

    var element = document.createElement('div');
    element.id = 'toggleGraticuleVisibility';
    element.className = 'toggle-graticule-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.ToggleGraticuleVisibility, ol.control.Control);

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.DisplayUserCoordinates = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconSatellite.png /><span class="tooltiptext">Position, heading & speed</span></div>';
    var coordinates_container = document.getElementById('user-coordinates');

    var this_ = this;
    var showCoordinatesPopup = function (e) {
        togglePopupDisplay(coordinates_container,'displayUserCoordinates');
    };

    button.addEventListener('click', showCoordinatesPopup, false);
    button.addEventListener('touchstart', showCoordinatesPopup, false);

    var element = document.createElement('div');
    element.id = 'displayUserCoordinates';
    element.className = 'display-usercoords-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.DisplayUserCoordinates, ol.control.Control);

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.ToggleFullscreen = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconFullscreen.png /><span class="tooltiptext">Toggle fullscreen</span></div>';
    //var coordinates_container = document.getElementById('user-coordinates');

    var this_ = this;
    var toggleFullscreen = function (e) {
        toggleFullscreenHelper();
    };

    button.addEventListener('click', toggleFullscreen, false);
    button.addEventListener('touchstart', toggleFullscreen, false);

    var element = document.createElement('div');
    element.id = 'toggleFullscreen';
    element.className = 'display-fullscreen-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.ToggleFullscreen, ol.control.Control);

/**
 * @constructor
 * @extends {ol.control.Control}
 * @param {Object=} opt_options Control options.
 */
app.StartPauseRouteRecord = function (opt_options) {

    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconStart.png /><span class="tooltiptext">Start/pause record</span></div>';
    // TODO : change start icon to Pause icon if active (and reciprocally)

    var this_ = this;
    var startPauseRouteRecord = function (e) {
        // Boolean used to store status
        this_.activeBool = !this_.activeBool;

        // Update HTML to display appropriate icon
        if (!this_.activeBool) {
            button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconStart.png /><span class="tooltiptext">Start/pause record</span></div>';
        } else {
            button.innerHTML = '<div class="tooltip"><img src=http://rendering/img/iconPause.png /><span class="tooltiptext">Start/pause record</span></div>';
        }

        // TODO : Start or Pause record depending on activeBool status (another button STOP will change the recorded route)
    };

    button.addEventListener('click', startPauseRouteRecord, false);
    button.addEventListener('touchstart', startPauseRouteRecord, false);

    var element = document.createElement('div');
    element.className = 'start-pause-record-control custom-control button';
    element.appendChild(button);

    ol.control.Control.call(this, {
        element: element,
        target: options.target
    });

};
ol_ext_inherits(app.StartPauseRouteRecord, ol.control.Control);