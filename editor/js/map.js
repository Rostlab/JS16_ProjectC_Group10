/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
    var mapOptions = {
        defaultCoords: [0, 0],
        mapMinZoom: 0,
        mapMaxZoom: 5
    };
    L.CRS.CustomZoom = L.extend({}, L.CRS.EPSG3857, {
        scale: function(e) {
            var t;
            switch (e) {
                case 4:
                    t = 2.166;
                    break;
                case 5:
                    t = 2.0915;
                    break;
                default:
                    t = 2;
            }
            return 256 * Math.pow(t, e);
        }
    });
    var n = {
        maxZoom: mapOptions.mapMaxZoom,
        minZoom: mapOptions.mapMinZoom,
        tapTolerance: 20,
        crs: L.CRS.CustomZoom,
        attributionControl: true
    };

    var map = L.map(document.getElementById('map'), n);
    var bounds = new L.LatLngBounds(L.latLng(85,-180), L.latLng(-43.85, 171.34));


    map.options.mapBounds = bounds;
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    map.on('zoomanim', function(e) { // Add a class to alter the labels
        var el = document.getElementById('map');
        if (el.className[el.className.length - 2] != 'm') {
            el.className += " zoom" + e.zoom;
        } else {
            el.className = el.className.slice(0, -1) + e.zoom;
        }
    });
    var r = new L.tileLayer("https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/{z}/y{y}x{x}.png", {
        minZoom: mapOptions.mapMinZoom,
        maxZoom: mapOptions.mapMaxZoom,
        bounds: bounds,
        errorTileUrl: 'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/blank.png',
        noWrap: true,
        attribution: 'Tiles &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
    });
    map.addLayer(r);
	markers = new L.layerGroup();
	cityMarkers = [];
	map.addLayer(markers);
	
	// JSON Out Button
	var editCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-edit');
			L.DomEvent.disableClickPropagation(c);
			c.onclick = function(){
				$('#editModal').modal('show');
			};
			return c;
		},
	});
	map.addControl(new editCtrl());
	
	// JSON Out Button
	var jsonCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-share');
			L.DomEvent.disableClickPropagation(c);
			c.onclick = function(){
				$('#jsonModal').modal('show');
				$('#jsonArea').val(JSON.stringify(cityInfo));
			};
			return c;
		},
	});
	map.addControl(new jsonCtrl());
	
    function onMapClick(e) {
	    if(curCity == -1) {
		    return;
	    }
	    var city = cityInfo[curCity];
	    var marker = cityMarkers[curCity];
	    if(marker) {
		    marker.setLatLng(e.latlng);
	    } else {
		    var marker = cityMarkers[curCity] = new L.marker(e.latlng, {
            	draggable: 'true'
        	}).bindPopup().addTo(markers);
	    }
        var position = e.latlng;
	    city.coord = [position.lat, position.lng];
        marker.setPopupContent("<h4>"+city.name+'</h4><button type="button" class="btn btn-danger" '+
        	'onclick="">Don\'t Save</button><button type="button" class="btn btn-success" '+
        	'>Save</button>').openPopup();
        marker.on('dragend', function(event) {
            var position = marker.getLatLng();
			city.coord = [position.lat, position.lng];
			marker.openPopup();
        });
    }
    map.on('click', onMapClick);
});