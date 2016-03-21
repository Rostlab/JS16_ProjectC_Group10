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
		'characterBox':'#characters',
		'timeline':'#timeline',
		'filter':'#filter input',
		'characterDataSource':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/data/characters.js',
		'episodeDataSource':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/data/episodes.js',
		'cityDataSource':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/data/cities.js',
		'realmDataSource':'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/data/realms.js'
	});
	var lmap = mymap.getMap();
		
		//Characters Button
		var charCtrl = L.Control.extend({
		    options: {
		        position: 'topright'
		    },
		    onAdd: function(map) {
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