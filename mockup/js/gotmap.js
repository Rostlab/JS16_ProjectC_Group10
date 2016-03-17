/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
var gotmap = function(mapContainer, options) {
	var options = {
		'filter':false,
		'sidebar':false,
		'timeline':false,
		'cityDataSource':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/data/cities.js', // https://got-api.bruck.me/api/cities
		'realmDataSource':'file:///Volumes/Max%20HD/Users/max/Documents/TUM/JavaScript/data/realms.js',
		'episodeDataSource':'file:///Volumes/Max%20HD/Users/max/Documents/TUM/JavaScript/data/episodes.js',
		'characterDataSource':false,
		'bgTiles':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/bg/{z}/y{y}x{x}.png',
		'labelTiles':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/labels/{z}/y{y}x{x}.png',
		'errorTile':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/blank.png'
	};
	var publicFunctions = {};
	
	mapContainer = document.getElementById(mapContainer);
	
	
	// INIT Leaflet Map
	var map, cityList, cityLayer, realmsList, realmsLayer, realmsShown;
	(function () {
		// Define a costum zoom handler because HBO did sth weird when scaling
		var hboZoom = L.extend({}, L.CRS.EPSG3857, {
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
		
		// Configure the map
		var mapOptions = {
			maxZoom: 5,
			minZoom: 0,
			crs: hboZoom,
			mapBounds: bounds
		};
		
		// Make the map and center it in the viewpoint
		map = L.map(mapContainer, mapOptions).fitBounds(bounds);
		
		// Limit the display
		map.setMaxBounds(bounds);
		
		// HBO BG Tiles
		new L.tileLayer(options.bgTiles, {
			bounds: bounds,
			errorTileUrl: options.errorTile,
			noWrap: true,
			attribution: 'BG &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
		}).addTo(map);
		
		// Alex' Labeled Tiles
		new L.tileLayer(options.labelTiles, {
			bounds: bounds,
			errorTileUrl: options.errorTile,
			noWrap: true
		}).addTo(map);
		
		// Init Layer + List
		cityLayer = new L.layerGroup().addTo(map);
		cityList = [];
		
		// Fetch the Data
		jQuery.get(options.cityDataSource, {},
			function (allCities){
				JSON.parse(allCities).map(function (place) {
					place.coords = [parseFloat(place.coordY), parseFloat(place.coordX)]; // 
					cityList[place.name] = place;
					var type = place.type || "other"; // Add Type to display correct label
					var prio = "prio"+place.priority; // Add priority to hide / show cities
					var extra = (place.priority == 6 || jQuery.inArray(place.name, ['Shadow Tower', 'Castle Black', 'Eastwatch by the Sea', 'Nightfort'])) ? " wall-label" : ""; 
					if(place.coordY && place.coordX) {
						L.marker(place.coords, {
							icon: L.divIcon({className: ['gotmarker', type, prio].join(' ')})
						}).on('click', function () {
							mapHelpers.wikiModal(place.link, place.name, place.type);
						}).bindLabel(place.name, {
							noHide: true, 
							direction:'right',
							className: ['gotlabel', extra, prio].join(' ')
						}).addTo(cityLayer);
					}
				});
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
		mapContainer.className += " zoom" + map.getZoom();
		
		// Init Layer + List
		realmsLayer = new L.LayerGroup();
		realmsList = [];
		realmsShown = false;
		
		jQuery.get(options.realmDataSource, {},
			function (allRealms){
				JSON.parse(allRealms).map(function (realm) {
					realm.poly = L.polygon(realm.path, {
						color: 'red', 
						opacity : 0.2
					}).bindLabel(realm.name, {
						className: 'gotmarker'
					}).addTo(realmsLayer);
					realmsList[realm.name] = realm;	
				});
		});
		
		//Realms Button
		var realmsCtrl = L.Control.extend({
		    options: {
		        position: 'topright'
		    },
		    onAdd: function(map) {
		        var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-flag');
		        L.DomEvent.disableClickPropagation(c);
		        c.onclick = function() {
			        publicFunctions.toggleRealms();
		        };
		        return c;
		    },
		});
		map.addControl(new realmsCtrl());
	})();
	
	
	// INIT Slider
	(function () {
		var selected = "0-1";
	
		var es = episodes; // Get them from the DB later
	
		$("#episodes").text(getEpisodeInfo(0) + " - " + getEpisodeInfo(1)); // Initialize it
	
		$("#episode-slider").slider({
			range: true,
			min: 0,
			max: es.length-1,
			values: [0, 1],
			animate: "slow",
			slide: function(event, ui) {
				selected = [ui.values[0], ui.values[1]];
				if (selected[0] == selected[1]) {
					selected = selected[0];
				} else {
					selected = selected[0] +"-"+ selected[1];
				}
				$("#episodes").text(getEpisodeInfo(ui.values[0]) + " - " + getEpisodeInfo(ui.values[1]));
				mapHelpers.updatePaths(selected);
			}
		});

	function getEpisodeInfo(i) {
	    if(i < es.length) {
        	return "S" + es[i].season + "E" + es[i].episode + ": " + es[i].title;
        } else {
	        return "No Episode found";
        }
    }
	})();
	
	/*
	 * showRealms
	 * 
	 * Shows the realm layer
	 * @TODO Options
	 *
	 * @return realmsShown
	 */
	publicFunctions.showRealms = function() {
		if(!realmsShown) {
			map.addLayer(realmsLayer);
			return realmsShown = true;
		}
	}
	
	/*
	 * hideRealms
	 * 
	 * Hide the realm layer
	 *
	 * @return realmsShown
	 */
	publicFunctions.hideRealms = function() {
		if(realmsShown) {
			map.removeLayer(realmsLayer);
			return realmsShown = false;
		}
	}
	
	/*
	 * toggleRealms
	 * 
	 * Invokes show/hide realm depending on realmsShown
	 *
	 * @return realmsShown
	 */
	publicFunctions.toggleRealms = function() {
		return realmsShown ? publicFunctions.hideRealms() : publicFunctions.showRealms();
	}
	
	/*
	 * credit
	 * 
	 * Show Team Members
	 *
	 * @return ourNames
	 */
	publicFunctions.credit = function() {
		return "GotMap by Maximilian Bandle @mbandle, Alexander Beischl @AlexBeischl, Tobias Piffrader @tobipiff";
	}
	
	return publicFunctions;
}

jQuery(function() {
	mymap = gotmap('map');
});