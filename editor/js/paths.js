/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
	var latlngs = [];
	var path = [];
	var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
	var dot = L.divIcon({className: 'point'});
	
	
	// Back Button
	var backCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-arrow-left');
			L.DomEvent.disableClickPropagation(c);
			c.onclick = function(){
				latlngs.pop();
				path.pop();
				polyline.setLatLngs(latlngs);
			};
			return c;
		},
	});
	map.addControl(new backCtrl());
	
	// Save to JSON Button
	var jsonCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-share');
			L.DomEvent.disableClickPropagation(c);
			c.onclick = function(){
				$('#jsonModal').modal('show');
				$('#jsonArea').val(JSON.stringify(path));
			};
			return c;
		},
	});
	map.addControl(new jsonCtrl());
	
	gotDB.getAll().map(function (place) {
   		L.marker(place.coord, {
	   		icon:dot
   		}).on('click', function (e) {
	    	addToPolyline(place.coord, place.name)
    	}).bindLabel(place.name, {direction:'auto'}).addTo(map);
    });
	
	function addToPolyline(c, info) {
		latlngs.push(c);
		info ? path.push([c.lat,c.lng, info]) : path.push([c.lat,c.lng]);
		polyline.setLatLngs(latlngs);
	}
	
	map.on("click", function(e) {addToPolyline(e.latlng)});
});


	/*
    function onMapClick(e) {
	    if(curCity == -1) {
		    return;
	    }
	    var city = cityInfo[curCity];
	    var marker = cityMarkers[curCity];
	    if(marker) {
		    marker.setLatLng(e.latlng);
	    } else {
		    marker = cityMarkers[curCity] = new L.marker(e.latlng, {
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
    map.on('click', onMapClick);*/