/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "builds/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	//require("./css/demo.css");
	__webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports) {

	/*____     _____   __  __
	 / ___| __|_   _| |  \/  | __ _ _ __
	| |  _ / _ \| |   | |\/| |/ _` | '_ \
	| |_| | (_) | |   | |  | | (_| | |_) |
	 \____|\___/|_|   |_|  |_|\__,_| .__/
	 Maximilian Bandle @mbandle    |_|
	 Alexander Beischl @AlexBeischl
	 Tobias Piffrader  @tpiffrader

	Run It

	*/
	jQuery(function() {
		mymap = gotmap('#map', {
			'apiLocation':apiLocation,
			'characterBox':'#characters',
			'timeline':'#timeline',
			'filter':'#filter input'
		});
		var lmap = mymap.getMap();
			
			//Characters Button
			var charCtrl = L.Control.extend({
			    options: {
			        position: 'topright'
			    },
			    onAdd: function() {
			        var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-user');
			        L.DomEvent.disableClickPropagation(c);
			        c.onclick = function() {
				        jQuery("#characters").fadeIn();
			        };
			        return c;
			    },
			});
			jQuery("<div class=\"closeOverlay\">Close Character Overlay</div>").click(function () {
				jQuery("#characters").fadeOut();
			}).appendTo("#characters");
			lmap.addControl(new charCtrl());
	});

/***/ }
/******/ ]);