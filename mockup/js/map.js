/*.--.	 Alex Max Tobi		  ,-. .--. 
 : .--'   Project C - Map	   .'  :: ,. :
 : : _ .--.  .--. .-..-..---.	`: :: :: :
 : :; :: ..'' .; :: :; :: .; `	: :: :; :
 `.__.':_;  `.__.'`.__.': ._.'	:_;`.__.'
						: :				
						:_;
*/
jQuery(function() {
	// Basic Zoom Config (6 levels)
	var zoomLevel = {
		min: 0,
		max: 5
	};
	
	// Minimum Layer of loaded Tiles
	var maxZoomLevel = -1;
	
	// Define a costum zoom handler because HBO did sth weird when scaling
	L.CRS.HBOZoom = L.extend({}, L.CRS.EPSG3857, {
		scale: function(zoom) {
			var factor;
			switch (zoom) {
				case 4:
					factor = 2.166;
					break;
				case 5:
					factor = 2.0915;
					break;
				default:
					factor = 2;
			}
			return 256 * Math.pow(factor, zoom);
		}
	});
	
	// Maximum viewable angle
	var bounds = new L.LatLngBounds(L.latLng(90,-180), L.latLng(-43.87, 171.37));
	
	// configure the map
	var mapOptions = {
		maxZoom: zoomLevel.max,
		minZoom: zoomLevel.min,
		crs: L.CRS.HBOZoom,
		mapBounds: bounds
	};
	
	// Make the map and center it in the viewpoint
	map = L.map(document.getElementById('map'), mapOptions).fitBounds(bounds);
	// Limit the display
	map.setMaxBounds(bounds);
	document.getElementById('map').className += " zoom" + map.getZoom();
	
	// HBO BG Tiles
	var bgTiles = new L.tileLayer("https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/bg/{z}/y{y}x{x}.png", {
		maxZoom: zoomLevel.max,
		minZoom: zoomLevel.min,
		bounds: bounds,
		errorTileUrl: 'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/blank.png',
		noWrap: true,
		attribution: 'BG &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
	});
	map.addLayer(bgTiles);
	// Alex' Labeled Tiles
	var labelTiles = new L.tileLayer("https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/labels/{z}/y{y}x{x}.png", {
		maxZoom: zoomLevel.max,
		minZoom: zoomLevel.min,
		bounds: bounds,
		errorTileUrl: 'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/blank.png',
		noWrap: true
	});
	map.addLayer(labelTiles);
	
	cities = new L.layerGroup();
	cityList = [];
	map.addLayer(cities);
	
	jQuery.get("https://got-api.bruck.me/api/cities", {}, 
		function (allCities){
			allCities.map(function (place) {
				cityList[place.name] = place;
				var type = place.type || "other";
				var prio = "prio"+place.priority;
				if(place.coordY && place.coordX) {
					L.marker([parseFloat(place.coordY), parseFloat(place.coordX)], {
						icon: L.divIcon({
							className: 'got '+type+' '+prio
							})
					}).on('click', function () {
						mapHelpers.wikiModal(place.link, place.name, place.type);
					}).bindLabel(place.name, {
						noHide: true, 
						direction:'auto',
						className: 'gotlabel '+prio
					}).addTo(cities);
				}
			});
			if(e) { // Fix the bug because the labels are also aligned in the zoomanim event
				cities.remove();
				map.addLayer(cities);
			}
	});
	
	// Add a class to alter the labels
	map.on('zoomanim', function(e) { 
		var el = document.getElementById('map');
		if (el.className[el.className.length - 2] != 'm') {
			el.className += " zoom" + e.zoom;
		} else {
			el.className = el.className.slice(0, -1) + e.zoom;
		}
	});
});