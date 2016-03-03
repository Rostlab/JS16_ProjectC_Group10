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
	var markers = new L.layerGroup();
	map.addLayer(markers);
	
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
			}
			return c;
		},
	});
	map.addControl(new delCtrl());

    var label = L.divIcon({
        className: 'sealabel big',
        html: 'The&nbsp;Shivening&nbsp;Sea'
    });
    L.marker([80, -30], {
        icon: label
    }).addTo(map);

    var label = L.divIcon({
        className: 'sealabel big',
        html: 'The&nbsp;Summer&nbsp;Sea'
    });
    L.marker([-23, -90], {
        icon: label
    }).addTo(map);
    var label = L.divIcon({
        className: 'sealabel',
        html: 'Sea&nbsp;of&nbsp;Dorne'
    });
    L.marker([17.5, -92], {
        icon: label
    }).addTo(map);



    function onMapClick(e) {
        var marker = new L.marker(e.latlng, {
            draggable: 'true'
        }).addTo(markers);
        var position = e.latlng;
        marker.bindPopup("" + position).openPopup();
        marker.on('dragend', function(event) {
            var position = marker.getLatLng();
            marker.unbindPopup().bindPopup("" + position).openPopup();
        });
    };
    map.on('click', onMapClick);
});