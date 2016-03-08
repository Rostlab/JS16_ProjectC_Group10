/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
    // Basic Zoom Config (6 levels)
    var zoomLevel = {
        min: 0,
        max: 5
    };
    
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
    
    // Add a class to alter the labels
    map.on('zoomanim', function(e) { 
        var el = document.getElementById('map');
        if (el.className[el.className.length - 2] != 'm') {
            el.className += " zoom" + e.zoom;
        } else {
            el.className = el.className.slice(0, -1) + e.zoom;
        }
    });
	var markers = new L.layerGroup();
	map.addLayer(markers);
	
	characterInfo = new L.layerGroup();
	map.addLayer(characterInfo);

	// Delete Button
	var delCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom deleteButton');
			L.DomEvent.disableClickPropagation(c);
			c.innerHTML = 'x';
			c.onclick = function(){
				markers.clearLayers();
			};
			return c;
		},
	});
	map.addControl(new delCtrl());
	
    // Add all Cities
    /*
    gotDB.getAll().map(function (place) {
	    var type = place.type || "other";
	    var prio = "prio"+place.prio;
   		L.marker(place.coord, {
        	icon: L.divIcon({
	        	className: 'got '+type+' '+prio
	        })
    	}).on('click', function () {
    		mapHelpers.wikiModal(place.link, place.name, place.type);
    	}).bindLabel(place.name, {
	    	noHide: true, 
	    	direction:'auto',
	        className: 'gotlabel '+prio
	    }).addTo(map);
    });
    */
    //GetCitiesFromDB
    jQuery.get("https://got-api.bruck.me/api/cities", {},function (allCities){
	    allCities.map(function (place) {
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
	    	}).addTo(map);
	    }
    	});
	});
    	
	var marker;
    function onMapClick(e) {
    	if(!marker) {
        	marker = new L.marker(e.latlng, {
        	    draggable: 'true',
        	    icon: mapHelpers.colorMarker('silver', defaultPersonImage)
        	}).bindLabel(undefined, {noHide: true}).addTo(markers);
        	marker.on('dragend', function(event) {
            	var position = marker.getLatLng();
            	marker.updateLabelContent("" + position).showLabel();
        	});
        } else {
        	marker.setLatLng(e.latlng);
        }
        var position = e.latlng;
        //marker.updateLabelContent("" + position).showLabel();
    }
    map.on('click', onMapClick);
});