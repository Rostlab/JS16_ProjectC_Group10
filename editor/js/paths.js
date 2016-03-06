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
	var polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
	var dot = L.divIcon({className: 'point'});
	
	gotDB.getAll().map(function (place) {
   		L.marker(place.coord, {
	   		icon:dot
   		}).on('click', function (e) {
	    	addToPolyline(e.latlng)
    	}).bindLabel(place.name, {direction:'auto'}).addTo(map);
    });
	
	function addToPolyline(c) {
		latlngs.push(c);
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