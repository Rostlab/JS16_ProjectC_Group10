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
	var editPoint = 0; // <-- Point in Polyline to edit
	
	// State Information
	var curCharacter = {}; // <-- set When edited
	var curPlace = false; // <-- Set when mouse over
	var pathChanged = false;
	var showPreview = true;
	
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
			 	place.coords = {lat:cy, lng:cx};
				L.marker([cy, cx], {
					icon: dot
				}).on('click', function() {
					addToPolyline(place.coords, {place:place.name}); // <-- when clicking on city point, this is the coordinate
				}).on('mouseover', function() {
					curPlace = place;
				}).on('mouseout', function () {
					curPlace = false;
				}).bindLabel(place.name, {
					direction: 'auto'
				}).addTo(map);
				jQuery('<option>'+place.name+'</option>').appendTo('#placename');
			}
		});
	});
	
	// Bei Click Punkt setzen
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
		for(var i = 0;i<chList.length;i++) {
			chList[i].el.appendTo(chListEl);
		}
	});
	
	jQuery("#filter input").on('keyup', function(e) {
		var search = jQuery("#filter input").val().toLowerCase();
		for(var i = 0;i<chList.length;i++) {
			if(chList[i].name.toLowerCase().indexOf(search) !== -1) {
				chList[i].el.show();
			} else {
				chList[i].el.hide();
			}
		}
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
		path.push({coords:c, info:(info||{})});
		pathChanged = true;
		redrawLine();
	}
	
	function redrawLine() {
		var editMarker = L.divIcon({
			className: 'editMarker'
		});
		var placeMarker = L.divIcon({
			className: 'editMarker place'
		});
		var episodeMarker = L.divIcon({
			className: 'editMarker episode'
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
		path.map(function (point, i) {
			var c = point.coords;
			var marker = point.info.place ? placeMarker : editMarker;
			var marker = point.info.episode ? episodeMarker : marker;
			L.marker(c, {
				icon: marker,
				draggable: true
			}).on('click', function(e) {
				jQuery('#editModal').modal('show');
				fillEditModal(path[i]);
				editPoint = i;
			}).on('dragstart', function (e) {
				showPreview = false;
			}).on('drag', function(e) {
				path[i].coords = e.latlng;
				refreshLine();
			}).on('dragend', function () {
				showPreview = true;
				pathChanged = true;
				if(curPlace) {
					path[i].coords = curPlace.coords;
					path[i].info.place = curPlace.name;
				} else {
					delete path[i].info.place;
				}
				redrawLine();
			}).on('contextmenu', function(e) {
				path.splice(i,1);
				redrawLine();
			}).addTo(editLayer);
			if(lastCoord) {
				var p1 = map.project(c);
				var p2 = map.project(lastCoord);
				var cMiddle = map.unproject(p1._add(p2)._divideBy(2));
				L.marker(cMiddle, {
					icon: addMarker,
					draggable: true
				}).on('dragstart', function(e) {
					showPreview = false;
					path.splice(i,0,cMiddle);
				}).on('drag', function(e) {
					path[i].coords = e.latlng;
					path[i].info = {};
					refreshLine();
				}).on('dragend', function () {
					showPreview = true;
					pathChanged = true;
					if(curPlace) {
						path[i].coords = curPlace.coords;
						path[i].info.place = curPlace.name;
					} else {
						delete path[i].info.place;
					}
					redrawLine();
				}).addTo(editLayer);
			}
			lastCoord = c;
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
	function showLineToNext(coords) {
		var l = path.length;
		if(showPreview && l > 0) {
			preview.setLatLngs([path[l-1].coords, coords]);
		} else {
			preview.setLatLngs([]);
		}
	}

	function setCharacter(c) {
		if(pathChanged && !confirm('Are you sure to drop the previous changes')) {
			return;
		}
		curCharacter = c;
		pathChanged = false;
		if(c.hasPath) {
			jQuery.get(apiLocation+"/characters/paths/"+c.name, {}, 
				function(data) {
					var pathOfCharacter = (typeof data == "object") ? data : JSON.parse(data);
					console.log(pathOfCharacter.data[0].path);
					path = importPath(pathOfCharacter.data[0].path);
					redrawLine();
				});
			
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
				jQuery('<option value="'+episode.totalNr+'">'+episode.showTitle+'</option>').appendTo('#episode');
			});
			var sliderEl = jQuery('<div></div>').appendTo('#timeline');
			var infoEl = jQuery('<p></p>').appendTo('#timeline');
			sliderEl.slider({
				range: true,
				min: 1,
				max: episodesCount,
				values: [1, episodesCount],
				animate: "slow",
				slide: function(event, ui) {
					var selected = [ui.values[0], ui.values[1]];
					setInfoText(selected);
				}
			});
			function setInfoText(range) {
				infoEl.text(getEpisodeInfo(range[0]) + " - " + getEpisodeInfo(range[1]));
			}
			setInfoText([1, episodesCount]);
	});


	function getEpisodeInfo(i) {
		var e = episodes[i];
		return e.showTitle;
	}
	
	jQuery("#editbutton").click(function () {
		saveEditModal(path[editPoint]);
	});
	
	function fillEditModal(point) {
		var info = point.info || {};
		jQuery("#placename").val(info.place || 0);
		jQuery("#episode").val(info.episode || 0);
		jQuery("#status").val(info.status || "alive");
	}
	
	function saveEditModal(point) {
		var info = {};
		info.place = jQuery("#placename").val();
		info.episode = jQuery("#episode").val();
		info.status = jQuery("#status").val();
		point.info = info;
		pathChanged = true;
	}
	
	function importPath(pathToC)
	{
		newPath = [];
		for(var i = 0; i < pathToC.length; i++)
		{
			newPath = newPath.concat(convertEpisode(pathToC[i].path, pathToC[i].to));
		}
		
		return newPath;
	}
	
	function convertEpisode(imPath, episodeEnd)
	{
		var point = {};
		var path = [];
		
		for(var i = 0; i < imPath.length; i++){ 
			var curr = imPath[i];
			point = {coords:{lat: curr[0], lng: curr[1]}, info: {}};
			
			if(curr.length == 3){
				point.info.place = curr[2];
			}
			
			if(i == imPath.length-1 && (typeof(episodeEnd) != "undefined")){
				point.info.episode = episodeEnd;
			}
			path.push(point);
		}
		return path;
	}
});
