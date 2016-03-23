/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
	
	map.pm.enableDraw('Poly');	
		
	map.pm.addControls();
	
	var imageUrl = './Essos-Realms-HD%20copy.jpg',
    imageBounds = new L.LatLngBounds(L.latLng(90,-155), L.latLng(-43.85, 171.34));
    
    L.imageOverlay(imageUrl, imageBounds, {opacity: 0.5}).addTo(map);
	
    // Save to JSON Button
    var jsonCtrl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function(map) {
            var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-share');
            L.DomEvent.disableClickPropagation(c);
            c.onclick = function() {
	            var latLngDirty;
	            if("length" in globalPolyline) {
	            	latLngDirty = globalPolyline;
				} else {
					latLngDirty = globalPolyline.getLatLngs();
				}
	            var latLngWanted = latLngDirty.map(function(curr)
	            	{
		            	return [curr.lat, curr.lng];
		           	});
                $('#jsonModal').modal('show');
                $('#jsonArea').val(JSON.stringify(latLngWanted));
            };
            return c;
        },
    });
    map.addControl(new jsonCtrl());
    
    $("#Load").click(function(){
	    var coord = JSON.parse($('#jsonArea').val());
	    var polygonLayer = L.polygon(coord).addTo(map);
		polygonLayer.pm.toggleEdit();
	    //p = new L.PM.Draw["Poly"](map);
	    //globalPolyline.setLatLngs(coord);
    });
});


