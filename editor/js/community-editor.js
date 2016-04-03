/*.--.	 Alex Max Tobi		  ,-. .--. 
 : .--'   Project C - Map	   .'  :: ,. :
 : : _ .--.  .--. .-..-..---.	`: :: :: :
 : :; :: ..'' .; :: :; :: .; `	: :: :; :
 `.__.':_;  `.__.'`.__.': ._.'	:_;`.__.'
						: :				
						:_;
*/
jQuery(function() {
	var apiLocation = "https://api.got.show/api";
	
	// Store the current path and the layer for all the markers
	var path = [];
	var polyline;
	var editLayer = new L.layerGroup().addTo(map);
	
	// Handle clicks on the map / cities
	
	// Default city icon (green dot)
	var dot = L.divIcon({
		className: 'point'
	});
	// Get all the cities and throw them onto the map
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
					addToPolyline({lat:cy, lng:cx}, place.name); // <-- when clicking on city point, this is the coordinate
				}).bindLabel(place.name, {
					direction: 'auto'
				}).addTo(map);
			}
		});
	});
	
	// Bei CLick Punkt setzen
	map.on("click", function(e) {
		addToPolyline(e.latlng);
	});
	
	// Show helper Line when moving
	map.on("mousemove", function(e) {
		showLineToNext(e.latlng);
	});
	
	// Init list to store all the characters
	var chListEl = jQuery("<ul></ul>").appendTo("#sidebar");
	var chList = [];
	
	// get the characters
	jQuery.get(apiLocation+"/characters", {}, function(data)
	{
		var characters = (typeof data == "object") ? data : JSON.parse(data);
		characters.map(function(c) 
	 	{
		 	if(c.name) {
			 	var cEl = jQuery("<li>"+c.name+"</li>");
			 	cEl.click(function (e) {
				 	setCharacter(c);
			 	});
			 	if(c.hasPath) {
				 	cEl.addClass('onmap');
			 	}
			 	c.el = cEl;
				chList.push(c);
			}
		});
		chList = chList.sort(function(c1,c2) {
			return (c2.pageRank ||-1) - (c1.pageRank || -1);
		});
		refillCharacterList();
	});
	
	function refillCharacterList() {
		chListEl.empty();
		for(var i = 0;i<chList.length;i++) {
			chList[i].el.appendTo(chListEl);
		}
	}
	
	jQuery("#filter input").on('keyup', function() {
		
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
		redrawLine();
	}
	
	function redrawLine() {
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
		cs.map(function (c, i) {
			L.marker(c, {
				icon: editMarker,
				draggable: true
			}).on('click', function(e) {
				jQuery('#editModal').modal('show');
			}).on('drag', function(e) {
				showPreview = false;
				path[i].coords = e.latlng;
				refreshLine();
			}).on('dragend', function () {
				showPreview = true;
				redrawLine();
			}).on('contextmenu', function(e) {
				path.splice(i,1);
				redrawLine();
			}).addTo(editLayer);
		});
	}
	
	function refreshLine() {
		polyline.setLatLngs(path.map(function(p) {
			return p.coords;
		}));
	}
	
	var preview = L.polyline([], {
		color: '#a00'
	}).addTo(map);
	var showPreview = true;
	function showLineToNext(coords) {
		var l = path.length;
		if(showPreview && l > 0) {
			preview.setLatLngs([path[l-1].coords, coords]);
		} else {
			preview.setLatLngs([]);
		}
	}

	function setCharacter(c) {
		if(c.hasPath) {
			alert("Here comes the loading");
		}
	}
	
	var episodes = [];
	
	jQuery.get(apiLocation+"/episodes", {},
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
