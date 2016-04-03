/*____     _____   __  __
 / ___| __|_   _| |  \/  | __ _ _ __
| |  _ / _ \| |   | |\/| |/ _` | '_ \
| |_| | (_) | |   | |  | | (_| | |_) |
 \____|\___/|_|   |_|  |_|\__,_| .__/
 Maximilian Bandle @mbandle    |_|
 Alexander Beischl @AlexBeischl
 Tobias Piffrader  @tpiffrader

Run It

*/
jQuery(function() {
	mymap = gotmap('#map', {
		'apiLocation':apiLocation,
		'characterBox':'#characters',
		'timeline':'#timeline',
		'filter':'#filter input'
	});
	var lmap = mymap.getMap();
		
		//Characters Button
		var charCtrl = L.Control.extend({
		    options: {
		        position: 'topright'
		    },
		    onAdd: function() {
		        var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-user');
		        L.DomEvent.disableClickPropagation(c);
		        c.onclick = function() {
			        jQuery("#characters").fadeIn();
		        };
		        return c;
		    },
		});
		jQuery("<div class=\"closeOverlay\">Close Character Overlay</div>").click(function () {
			jQuery("#characters").fadeOut();
		}).appendTo("#characters");
		lmap.addControl(new charCtrl());
});