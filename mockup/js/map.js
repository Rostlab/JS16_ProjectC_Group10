jQuery(function(){
var i = {
    defaultCoords: [0, 0],
    mapMinZoom: 0,
    mapMaxZoom: 5,
    mapPanDuration: 1,
    miniMapZoomLevel: 2.668,
    filtersCollection: {}
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
            case i.miniMapZoomLevel:
                t = 2;
                break;
            default:
                t = 2;
        }
        return 256 * Math.pow(t, e);
    }
});
var n = {
    maxZoom: i.mapMaxZoom,
    minZoom: i.mapMinZoom,
    tapTolerance: 20,
    crs: L.CRS.CustomZoom,
    attributionControl: true
};

var map = L.map(document.getElementById('map'), n);
var o = new L.LatLngBounds(map.unproject([0, 300], 1), map.unproject([500, 0], 1));

map.options.mapBounds = o;
map.fitBounds(o);
map.setMaxBounds(o);
map.off("movestart").on("movestart", function(e) {
    e.target.dragging._draggable && e.target.dragging._draggable.on("predrag", function() {
        var e = map.latLngToLayerPoint(map.options.maxBounds.getSouthWest()).add(this._newPos);
        var t = map.latLngToLayerPoint(map.options.maxBounds.getNorthEast()).add(this._newPos);
        var i = map.getSize();
        t.y > 0 && (this._newPos.y -= t.y / 1.2), e.x > 0 && (this._newPos.x -= e.x / 1.2), t.x < i.x && (this._newPos.x -= (t.x - i.x) / 1.2), e.y < i.y && (this._newPos.y -= (e.y - i.y) / 1.2)
    })
});
map.on('zoomanim', function(e) {
    var el = document.getElementById('map');
    if (el.className[el.className.length - 2] != 'm') {
        el.className += " zoom" + e.zoom;
    } else {
        el.className = el.className.slice(0, -1) + e.zoom;
    }
});
//var r = new L.tileLayer("http://viewers-guide.hbo.com/mapimages/{z}/y{y}x{x}.png", {
var r = new L.tileLayer("https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/{z}/y{y}x{x}.png", {
    minZoom: i.mapMinZoom,
    maxZoom: i.mapMaxZoom,
    bounds: o,
    noWrap: true,
    attribution: 'Tiles &copy; HBO'
});

map.addLayer(r);

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
    }).addTo(map);
    var position = e.latlng;
    marker.bindPopup("" + position).openPopup();
    marker.on('dragend', function(event) {
        var position = marker.getLatLng();
        marker.unbindPopup().bindPopup("" + position).openPopup();
    });
};
map.on('click', onMapClick);
});