/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
    var realm = [];
    var polygon = L.polygon([], {
        color: 'red'
    }).addTo(map);
    var dot = L.divIcon({
        className: 'point'
    });
   
    // Back Button
    var backCtrl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function(map) {
            var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-arrow-left');
            L.DomEvent.disableClickPropagation(c);
            c.onclick = function() {
                realm.pop();
                polygon.setLatLngs(realm);
            };
            return c;
        },
    });
    map.addControl(new backCtrl());

    // Save to JSON Button
    var jsonCtrl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function(map) {
            var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-share');
            L.DomEvent.disableClickPropagation(c);
            c.onclick = function() {
                $('#jsonModal').modal('show');
                $('#jsonArea').val(JSON.stringify(realm));
            };
            return c;
        },
    });
    map.addControl(new jsonCtrl());
    
    $("#Load").click(function(){
	    realm = JSON.parse($('#jsonArea').val());
	    polygon.setLatLngs(realm);     
    });
    

	/*jQuery.get("https://got-api.bruck.me/api/cities", {}, function(cities)
	{
		console.log(cities);
	 	cities.map(function(place) 
	 	{
		 	if(place.coordY && place.coordX) {
			 	var cx = parseFloat(place.coordX);
			 	var cy = parseFloat(place.coordY);
        		L.marker([cy, cx], {
            		icon: dot
        		}).on('click', function(e) {
            		addToPolygon({lat:cy, lng:cx}, place.name);
        		}).bindLabel(place.name, 
        			{
					direction: 'auto'
        			}).addTo(map);
        	}
    	});
    });
    */

    function addToPolygon(c, info) {

        realm.push([c.lat, c.lng]);
        polygon.setLatLngs(realm);
    }

    map.on("click", function(e) {
        addToPolygon(e.latlng);
    });
});
