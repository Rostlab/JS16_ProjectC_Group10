/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
var map, markers;
jQuery(function() {
    L.CRS.CustomZoom = L.extend({}, L.CRS.EPSG3857, {
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
    map = L.map(document.getElementById('map'), {
        tapTolerance: 20,
        crs: L.CRS.CustomZoom
    });
    var bounds = new L.LatLngBounds(L.latLng(85,-180), L.latLng(-43.85, 171.34));


    map.options.mapBounds = bounds;
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    
    var r = new L.tileLayer("http://tiles.got.show/bg/{z}/y{y}x{x}.png", {
        minZoom: 0,
        maxZoom: 5,
        bounds: bounds,
        errorTileUrl: 'http://tiles.got.show/blank.png',
        noWrap: true,
        attribution: 'Tiles &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
    });
    map.addLayer(r);
    
    var labels = new L.tileLayer("http://tiles.got.show/labels/{z}/y{y}x{x}.png", {
        minZoom: 0,
        maxZoom: 5,
        bounds: bounds,
        errorTileUrl: 'http://tiles.got.show/blank.png',
        noWrap: true,
        attribution: 'Tiles &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
    });
    map.addLayer(labels);
	
	markers = new L.layerGroup();
	map.addLayer(markers);
});