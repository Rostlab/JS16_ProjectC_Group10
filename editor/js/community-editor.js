/*.--.	 Alex Max Tobi		  ,-. .--. 
 : .--'   Project C - Map	   .'  :: ,. :
 : : _ .--.  .--. .-..-..---.	`: :: :: :
 : :; :: ..'' .; :: :; :: .; `	: :: :; :
 `.__.':_;  `.__.'`.__.': ._.'	:_;`.__.'
						: :				
						:_;
*/
jQuery(function() {
	var apiLocation = "http://got-api.bruck.me/api";
	
	// Store the current path
	var path = [];
	var editLayer = new L.layerGroup().addTo(map);
	
	// Handle clicks on the map / cities
	
	var dot = L.divIcon({
		className: 'point'
	});
	jQuery.get(apiLocation+"/cities", {}, function(data)
	{
		var cities = (typeof data == "object") ? data : JSON.parse(data);
		cities.map(function(place) 
	 	{
		 	if(place.coordY && place.coordX) {
			 	var cx = parseFloat(place.coordX);
			 	var cy = parseFloat(place.coordY);
				L.marker([cy, cx], {
					icon: dot
				}).on('click', function(e) {
					addToPolyline({lat:cy, lng:cx}, place.name);
				}).bindLabel(place.name, {
					direction: 'auto'
				}).addTo(map);
			}
		});
	});
	map.on("click", function(e) {
		addToPolyline(e.latlng);
	});
   

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
				$('#jsonArea').val(JSON.stringify(path));
			};
			return c;
		},
	});
	map.addControl(new jsonCtrl());


	function addToPolyline(c, info) {
		path.push({coords:c, info:info});
		showLine();
	}
	var polyline;
	function showLine() {
		var editMarker = L.divIcon({
			className: 'editMarker'
		});
		var addMarker = L.divIcon({
			className: 'addMarker'
		});
		var cs = path.map(function(p) {
			return p.coords;
		});
		editLayer.clearLayers();
		polyline = L.polyline(cs, {
			color: '#03A9F4'
		}).addTo(editLayer);
		var lastCoord = false;
		cs.map(function (c, i) {
			L.marker(c, {
				icon: editMarker,
				draggable: true
			}).on('drag', function(e) {
				path[i].coords = e.latlng;
				refreshLine();
			}).on('dragend', function () {
				showLine();
			}).on('click', function(e) {
				//
			}).addTo(editLayer);
			if(lastCoord) {
				L.marker([(lastCoord.lat+c.lat)/2, (lastCoord.lng+c.lng)/2], {
					icon: addMarker,
					draggable: true
				}).on('click', function(e) {
					//
				}).addTo(editLayer);
			}
			lastCoord = c;
		})
	}
	
	function refreshLine() {
		polyline.setLatLngs(path.map(function(p) {
			return p.coords;
		}));
	}

	var episodes = [];
	
	jQuery.get("../data/episodes.js", {},
			function (data){
				var allEpisodes = (typeof data == "object") ? data : JSON.parse(data);
				var episodesCount = allEpisodes.length;
				allEpisodes.map(function (episode) {
					episode.showTitle = "S" + episode.season +"E"+episode.nr+": " + episode.name;
					episodes[episode.totalNr]=episode;
				});
	});


	function getEpisodeInfo(i) {
		var e = episodes[i];
		return e.showTitle;
	}
});
