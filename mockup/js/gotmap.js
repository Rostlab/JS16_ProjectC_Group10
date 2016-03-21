/*____     _____   __  __
 / ___| __|_   _| |  \/  | __ _ _ __
| |  _ / _ \| |   | |\/| |/ _` | '_ \
| |_| | (_) | |   | |  | | (_| | |_) |
 \____|\___/|_|   |_|  |_|\__,_| .__/
 Maximilian Bandle @mbandle    |_|
 Alexander Beischl @AlexBeischl
 Tobias Piffrader  @tpiffrader
*/
gotmap = function(mapContainer, options) {
	var defaultOptions = {
		'filter':false,
		'timeline':false,
		'characterBox':false,
		'cityDetails':function(modal, city) {internalHelpers.loadWikiPage(modal,city);},
		'characterDetails':function(modal, character) {internalHelpers.loadWikiPage(modal,character);},
		'defaultPersonImg':'http://map.got.show/mockup/img/persons/dummy.jpg',
		'deadPersonImg':'http://map.got.show/mockup/img/persons/skull.png',
		'cityDataSource':'https://got-api.bruck.me/api/cities',
		'realmDataSource':'https://got-api.bruck.me/api/realms',
		'pathDataSource':'https://got-api.bruck.me/api/paths',
		'episodeDataSource':'https://got-api.bruck.me/api/episodes/',
		'characterDataSource':'https://got-api.bruck.me/api/characters/',
		'bgTiles':'http://tiles.got.show/bg/{z}/y{y}x{x}.png',
		'labelTiles':'http://tiles.got.show/labels/{z}/y{y}x{x}.png',
		'errorTile':'http://tiles.got.show/blank.png',
		'characterColors':['#F44336', '#2196F3', '#4CAF50', '#212121', '#7C4DFF', '#F8BBD0', '#FBC02D', '#795548', 
		'#00796B', '#536DFE', '#FFFFFF', '#FF5722']
	};
	
	// Merge User and Default Options
	if(typeof options == 'object') {
		for(var option in defaultOptions) {
			if(!(option in options)) {
				options[option] = defaultOptions[option];
			}
		}
	} else {
		options = defaultOptions;
	}
	
	// Will be later returned
	var publicFunctions = {};
	
	// Just to do internal Stuff
	var internalHelpers = {};
	
	// All the containers
	mapContainer = jQuery(mapContainer).addClass("gotmap");
	var timelineContainer = options.timeline ? jQuery(options.timeline).addClass("gotmap-timeline") : jQuery('<div></div>');
	var characterContainer = options.characterBox ? jQuery(options.characterBox).addClass("gotmap-character") : jQuery('<div></div>');
	var filterContainer = options.filter ? jQuery(options.filter).addClass("gotmap-filter") : jQuery('<div></div>');
	
	// INIT Leaflet Map
	var map, cityStore, cityLayer, realmStore, realmsLayer, colorlessLayer, realmsShown, realmsColored;
	
	(function () {
		// Define a costum zoom handler because HBO did sth weird when scaling
		var hboZoom = L.extend({}, L.CRS.EPSG3857, {
			scale: function(zoom) {
				var factor;
				switch (zoom) {
					case 4:
						factor = 2.166;
						break;
					case 5:
						factor = 2.0915;
						break;
					default:
						factor = 2;
				}
				return 256 * Math.pow(factor, zoom);
			}
		});
		
		// Maximum viewable angle
		var bounds = new L.LatLngBounds(L.latLng(90,-180), L.latLng(-43.87, 171.37));
		
		// Configure the map
		var mapOptions = {
			maxZoom: 5,
			minZoom: 0,
			crs: hboZoom,
			mapBounds: bounds
		};
		
		// Make the map and center it in the viewpoint
		map = L.map(mapContainer[0], mapOptions).fitBounds(bounds);
		
		// Limit the display
		map.setMaxBounds(bounds);
		
		// HBO BG Tiles
		new L.tileLayer(options.bgTiles, {
			bounds: bounds,
			errorTileUrl: options.errorTile,
			noWrap: true,
			attribution: 'BG &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
		}).addTo(map);
		
		// Alex' Labeled Tiles
		new L.tileLayer(options.labelTiles, {
			bounds: bounds,
			errorTileUrl: options.errorTile,
			noWrap: true
		}).addTo(map);
		
		// Init Layer + List
		cityLayer = new L.layerGroup().addTo(map);
		cityStore = {};
		
		// Fetch the Data
		jQuery.get(options.cityDataSource, {},
			function (data) {
				var allCities = (typeof data == "object") ? data : JSON.parse(data);
				allCities.map(function (place) {
					place.coords = [parseFloat(place.coordY), parseFloat(place.coordX)]; // 
					cityStore[place.name] = place;
					var type = place.type || "other"; // Add Type to display correct label
					var prio = "prio"+place.priority; // Add priority to hide / show cities
					var extra = (place.priority == 6 || jQuery.inArray(place.name, ['Shadow Tower', 'Castle Black', 'Eastwatch by the Sea', 'Nightfort']) != -1) ? " wall-label" : ""; 
					if(place.coordY && place.coordX) {
						L.marker(place.coords, {
							icon: L.divIcon({className: ['gotmarker', type, prio].join(' ')})
						}).on('click', function () {
							publicFunctions.showModal(options.cityDetails, place, place.type);
						}).bindLabel(place.name, {
							noHide: true, 
							direction:'right',
							className: ['gotlabel', extra, prio].join(' ')
						}).addTo(cityLayer);
					}
				});
		});
		
		// Add a class to alter the labels
		map.on('zoomanim', function(e) { 
			var el = mapContainer[0];
			if (el.className[el.className.length - 2] != 'm') {
				el.className += " zoom" + e.zoom;
			} else {
				el.className = el.className.slice(0, -1) + e.zoom;
			}
		});
		mapContainer.addClass(" zoom" + map.getZoom());
		
		// Init Layer + List
		realmsLayer = new L.LayerGroup();
		colorlessLayer = new L.LayerGroup(); //TODO?
		realmStore = {};
		realmsShown = false;
		realmsColored = false;
	
		jQuery.get(options.realmDataSource, {},
			function (data){
				var allRealms = (typeof data == "object") ? data : JSON.parse(data);
				allRealms.map(function (realm) {
					//Initilizes the different realms
					realm.poly = L.polygon(realm.path, {
						color: realm.color || 'red', 
						opacity : 0.4
					}).bindLabel(realm.name, {
						className: 'gotmarker'
					}).addTo(realmsLayer);
					realmStore[realm.name] = realm;	
					//Initilizes the political map, just showing boarders
					L.polygon(realm.path, {
						color:'red', 
						opacity : 0.2,
						fillOpacity: 0.0
					}).bindLabel(realm.name, {
						className: 'gotmarker'
					}).addTo(colorlessLayer);
				});
		});
		
		//Realms Button
		var realmsCtrl = L.Control.extend({
		    options: {
		        position: 'topright'
		    },
		    onAdd: function(map) {
		        var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-flag');
		        L.DomEvent.disableClickPropagation(c);
		        c.onclick = function() {
			        publicFunctions.toggleRealms();
		        };
		        return c;
		    },
		});
		map.addControl(new realmsCtrl());
	})();
	
	
	// INIT Timeline
	var episodeStore, prevSelected;
	(function () {
		// Append the Containers
		var sliderEl = jQuery('<div></div>').appendTo(timelineContainer);
		var infoEl = jQuery('<p></p>').appendTo(timelineContainer);
		
		// Init List
		episodeStore = [];
		prevSelected = [1,2];
		
		// Fetch the Data
		jQuery.get(options.episodeDataSource, {},
			function (data){
				var allEpisodes = (typeof data == "object") ? data : JSON.parse(data);
				var episodesCount = allEpisodes.length;
				allEpisodes.map(function (episode) {
					episode.showTitle = "S" + episode.season +"E"+episode.nr+": " + episode.name;
					episodeStore[episode.totalNr]=episode;
				});
				setInfoText(prevSelected);
				sliderEl.slider({
					range: true,
					min: 1,
					max: episodesCount,
					values: prevSelected,
					animate: "slow",
					slide: function(event, ui) {
						var selected = [ui.values[0], ui.values[1]];
						setInfoText(selected);
						publicFunctions.updateMap(selected);
					}
				});
			}
		);
		
		function setInfoText(range) {
			infoEl.text(getEpisodeInfo(range[0]) + " - " + getEpisodeInfo(range[1]));
		}
		
		// Helper for Episode Info
		function getEpisodeInfo(i) {
			if(i < episodeStore.length) {
				return episodeStore[i].showTitle;
			} else {
				return "No Episode found";
			}
		}
	})();
	
	// INIT Filterbar and Characterlist
	var characterStore;
	(function () {
		// Init Elements
		var f = filterContainer; // Filter Element
		var l = jQuery('<ul class="dropdown-menu gotmap-dropdown"><li class="dropdown-header">Nothing found</li></ul>').insertAfter(f); // Dropdown
		
		// Init private helper Vars
		var selectedInDropdown = 0; // Index of highlighted Dropdown element
		var inputVal = ""; // Last used input
		var mouseOn = false; // Mouse over list?
		var focusOn = false; // Cursor in input?
		
		// Init List
		characterStore = {}; // Character Store
		
		var pathList = ['Eddard Stark', 'Catelyn Stark', 'Tywin Lannister', 'Robb Stark', 'Sansa Stark', 
		'Bran Stark', 'Arya Stark', 'Rickon Stark', 'Jon Snow', 'Daenerys Targaryen', 'Jaime Lannister', 
		'Cersei Lannister', 'Tyrion Lannister', 'Drogo', 'Viserys Targaryen', 'Joffrey Baratheon', 'Myrcella Baratheon', 'Tommen Baratheon', 'Robert Baratheon',
		'Stannis Baratheon','Renly Baratheon','Theon Greyjoy', 'Asha Greyjoy','Victorian Greyjoy','Brienne of Tarth', 'Davos Seaworth', 'Samwell Tarly', 'Petyr Baelish'];
		
		jQuery.get(options.characterDataSource, {}, function(data) {
			var allCharacters = (typeof data == "object") ? data : JSON.parse(data);
			allCharacters.map(function (character) {
				if(character.name) {
					character.imageLink = character.imageLink ? "http://awoiaf.westeros.org/"+character.imageLink : options.defaultPersonImg;
					character.pathInfo = pathList.indexOf(character.name) != -1;
					characterStore[character.name.toLowerCase()] = character;
				}
			});
		});
		
		// Set events to know where the mouse is and do fading
		l.mouseenter(function() { // No need to fade in because it is already
			mouseOn = true;
		});
		
		l.mouseleave(function() {
			mouseOn = false;
			if(!focusOn) {
				l.fadeOut();
			}
		});
		
		// Set events to know where the cursor is and fade the list in/out
		f.focusin(function () {
			focusOn = true;
			l.fadeIn();
		});
		f.focusout(function () {
			focusOn = false;
			if(!mouseOn) {
				l.fadeOut();
			}
		});
		
		// Get the Return / UP / Down Keys early to prevent default beahvior
		f.keydown(function (event) {
			var key = event.keyCode;
			if(key == 13 || key == 38 || key == 40) {
				var lEl = l.find("li"); // All list elements
				event.preventDefault();
				if(key == 13) { // Return
						$(lEl[selectedInDropdown]).trigger('click'); // Click the Selected
						f.trigger('blur'); // leave the input
						selectedInDropdown = 0; // Delete Selection
						return;
				}
				$(lEl[selectedInDropdown]).removeClass('hover');
				if(key == 38) { // Up
					if(selectedInDropdown > 0) {
						selectedInDropdown--; // Move Selection Up
					}
				} else { // Down
					if(selectedInDropdown < lEl.length) {
						selectedInDropdown++; // Move Selection Down
					}
				}
				$(lEl[selectedInDropdown]).addClass('hover'); // Add hover to the new el
			}
		});
		
		// Trigger the search 
		f.keyup(function(event) {
			var s = f.val().toLowerCase();
			if(s == inputVal) { // Only when sth new happens
				return;
			} 
			inputVal = s;
			selectedInDropdown = 0;
			
			var out = publicFunctions.searchCharacter(inputVal, 20);
			
			l.empty(); // Delete the HTML li Elements
			if(out.length) {
				out.map(function(character,i) {
					var extra = character.pathInfo ? ' class="pathInfo"' : '';
					var item = jQuery('<li'+extra+'><a href="#"><img src="'+character.imageLink+'" class="img-circle"/>'+
						character.name+'</a></li>'
					).click(function(e) {
						publicFunctions.addCharacter(character);
						l.fadeOut();
						return false;
					});
					if(i === 0) {
						item.addClass('hover');
					}
					l.append(item);
				});
			} else {
				l.append('<li class="dropdown-header">Nothing found</li>');
			}
		});
	})();
	
	// INIT Modal
	var	gotModal = jQuery('<div class="modal fade gotmap-modal" tabindex="-1" role="dialog">'+
			'<div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header">'+
			'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
			'<h3 class="modal-title"></h3></div><div class="modal-body"></div><div class="modal-footer">'+
			'<div class="pull-left classes"></div><a href="#" class="btn btn-warning wikilink" target="_blank">Show in Wiki</a>'+
			'<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div></div></div></div>');
	$('body').append(gotModal);
	
	// INIT Characters
	var loadedCharacters = [];
	var characterCurrentId = 0;
	var characterLayer = new L.layerGroup().addTo(map);
	
	//########################################################//
	//                                                        //
	//                   Internal Functions                   //
	//                                                        //
	//########################################################//
	
	internalHelpers.loadWikiPage = function(gotModal, obj) {
		var title = obj.name; 
		var link = "http://awoiaf.westeros.org/index.php/"+title;
		var bodyEl = gotModal.find('.modal-body'); // Body Container
		// Show Spinner
		bodyEl.html("<span class='glyphicon glyphicon-cog glyph-spin glyph-big'></span>").addClass('text-center'); 
		
		var cEl = gotModal.find('.modal-footer .classes').empty(); // Classes Container
		gotModal.find('.wikilink').attr('href', link); // Update the Wiki-Link
		
		// Get the wiki
		jQuery.ajax({
			url: link 
		}).success(function(x) { // Show it
			var content = jQuery(x).find("#bodyContent");
			bodyEl.removeClass('text-center'); // Make it left aligned
			content.find("img").each(function (i, el) { // Fix the image URL
				el.src = "http://awoiaf.westeros.org"+el.src.substr(el.src.indexOf("/i"));
			});
			content.find("a").each(function (i, el) { // Fix the links
				if(el.href.indexOf("/i") !== -1)
				{
					el.href = "http://awoiaf.westeros.org"+el.href.substr(el.href.indexOf("/i"));
					el.target = "_blank";
				}
			});
			content.find(".catlinks li a").each(function (i, el) { // Pull the catlinks in the modal footer
				$(el).addClass("btn").addClass("btn-default").addClass("pull-left");
				cEl.append(el);
			});
			bodyEl.html(content);
		}).error(function () { // Display Error Message
			bodyEl.html("<span class='glyphicon glyphicon-alert glyph-big text-danger'></span>");
		});
	};
	
	
	//########################################################//
	//                                                        //
	//                    Public Functions                    //
	//                                                        //
	//########################################################//
	
	publicFunctions.getMap = function() {
		return map;
	}
	
	// Modal Functions
	
	publicFunctions.showModal = function (callback, obj, cssclass) {
		gotModal.modal('show'); // Show the Modal
		var title = obj.name; 
    	var headerEl = gotModal.find('.modal-header'); // Header Container
		if (title) { // If there is a title
			headerEl.show(); // Show the Top Bar
			gotModal.find('h3').text(title); // Set the Title
			headerEl[0].className = "modal-header"; // Reset Classnames
			if(cssclass) { // Append classes when existing
				headerEl.addClass(cssclass);
			}
		} else {
			headerEl.hide(); // Hide it
		}
		
		callback(gotModal, obj);
	};
	
	publicFunctions.hideModal = function() {
		gotModal.modal('hide'); // Show the Modal
	};
	
	// Character Functions
	
	publicFunctions.addCharacter = function (character) {
		var id = character.name;
		if(loadedCharacters[id]) { // If  in the list, show it
			return publicFunctions.showCharacter(id);
		} else {
			var colors = options.characterColors;
			character.color = colors[characterCurrentId % colors.length]; // Assign a color
			characterCurrentId++; // # of Characters
			character.markerStyle = L.divIcon({
				className: 'colormarker',
				html:'<span class="glyphicon glyphicon-map-marker" style="color:'+character.color+';">'+
				'<img src="'+character.imageLink+'" /></span>'
			});
			character.deadStyle = L.divIcon({
				className: 'colormarker',
				html:'<span class="glyphicon glyphicon-map-marker" style="color:'+character.color+';">'+
				'<img src="'+options.deadPersonImg+'" /></span>'
			});
			// Load Additional Information
			if(character.pathInfo) {
				// TODO: Use the DB
				character.path = paths[id];
			} else {
				character.points = [];
				// TODO: Use the DB
				jQuery.ajax({url:"https://awoiaf.westeros.org/index.php?action=raw&title="+character.name}).success(function(data) {
					var re = /\[\[([^\]]+)\]\]/g; // Find Link
					var m;
					
					while ((m = re.exec(data)) !== null) {
						if (m.index === re.lastIndex) {
							re.lastIndex++;
						}
						var place = cityStore[m[1].replace('_', ' ')];
						if(place) {
							character.points.push(place.coords);
						}
					}
					publicFunctions.updateMap();
					publicFunctions.focusOnCharacter(id);
				}); 
			}
			
			// Make new element
			var characterElement = jQuery('<div class="character"><img src="'+character.imageLink+'"'+
				'class="img-circle" style="border-color:'+character.color+'"/></div>');
			var charInfo = jQuery('<div class="characterinfo"></div>');
			charInfo.append('<div class="name">'+character.name+'</div>');
			if(character.house){
				charInfo.append('<div class="house">'+character.house+'</div>');
			}
			var moreInfo = jQuery('<a>More info</a>');
			charInfo.append(moreInfo);
			var deleteButton = jQuery('<span class="delete glyphicon glyphicon-remove"></span>');
			charInfo.append(deleteButton);
			characterElement.append(charInfo);
			character.shown = true;
			
			// Bind events
			characterElement.click(function () {
				publicFunctions.toggleCharacter(id);
			});
			
			deleteButton.click(function () {
				publicFunctions.removeCharacter(id);
				return false; // Prevent Default + Bubbling
			});
			
			moreInfo.click(function () {
				publicFunctions.showModal(options.characterDetails, character, "person "+(character.house ? character.house.toLowerCase() : ''));
				return false; // Prevent Default + Bubbling
			});
			
			// Append it to the characters list
			characterContainer.append(characterElement);
			character.el = characterElement; // Save it to be able to delete it later
			
			loadedCharacters[id] = character; // Save It
			
			publicFunctions.updateMap();
			publicFunctions.focusOnCharacter(id);
			
			return id;
		}
	};
	
	publicFunctions.removeCharacter = function (id) {
		if(loadedCharacters[id]) {
			loadedCharacters[id].el.remove(); // Delete from DOM
			delete loadedCharacters[id]; // Delete From List
			publicFunctions.updateMap();
			return true; // Sucess
		}
		return false; // Failed
	};
	
	publicFunctions.showCharacter = function (id) {
		if(loadedCharacters[id]) {
			var character = loadedCharacters[id]; // Shortcut
			if(!character.shown) {
				character.el.removeClass('disabled');
				character.shown = true;
				publicFunctions.updateMap();
			}
			return character.shown;
		}
	};
	
	publicFunctions.hideCharacter = function (id) {
		if(loadedCharacters[id]) {
			var character = loadedCharacters[id]; // Shortcut
			if(character.shown) {
				character.el.addClass('disabled');
				character.shown = false;
				publicFunctions.updateMap();
			}
			return character.shown;
		}
	};
	
	publicFunctions.toggleCharacter = function (id) {
		if(loadedCharacters[id]) { 
			// Just jump to the right function
			return loadedCharacters[id].shown ? publicFunctions.hideCharacter(id) : publicFunctions.showCharacter(id);
		}
	};
	
	publicFunctions.hideAllCharacters = function () {
		for(var id in loadedCharacters) { // Iterate through all
			publicFunctions.hideCharacter(id);
		}
	};
	
	publicFunctions.showAllCharacters = function () {
		for(var id in loadedCharacters) { // Iterate through all
			publicFunctions.showCharacter(id);
		}
	};
	
	publicFunctions.removeAllCharacters = function () {
		for(var id in loadedCharacters) { // Iterate through all
			publicFunctions.removeCharacter(id);
		}
	};
	
	publicFunctions.searchCharacter = function (search, maxResults) {
		var o1 = []; // Begins with
		var o2 = []; // Contains
		var p;
		for(var cName in characterStore) {
			var pos = cName.indexOf(search);
			if(pos != -1) {
				(pos === 0 ? o1 : o2).push(characterStore[cName]);
				if((maxResults--) === 0) {
					break;
				}
			}
		}
		return o1.concat(o2); // First beginning with search, then the rest
	};
	
	publicFunctions.focusOnCharacter = function (id) {
		if(loadedCharacters[id]) { 
		var points = characterLayer.getLayers().filter(function (obj) {
			return obj.character.name == id;
		}).reduce(function (init, obj) {
			if(obj._latlng) {
				init.push(obj._latlng);
				return init;
			} else {
				return init.concat(obj._latlngs);
				}
		}, []);
		if(points.length > 0) {
			map.fitBounds(L.latLngBounds(points));
			return true;
		} else {
			return false;
		}
		}
	};
	
	// Timeline Functions
	
	publicFunctions.updateMap = function (selected) {
		if(!selected) {
			selected = prevSelected;
		} else {
			prevSelected = selected;
		}
		characterLayer.clearLayers(); // Clear the Pane
		var markers = []; // Store All Markers
		var polylines = []; // Store All Polylines
		
		var pathShown = function (path) {
			if(!path.from) {
				return selected[0] <= path.to;
			}
			if(!path.to) {
				return selected[1] >= path.from;
			}
			// As long as the ranges colide, it will show
			return selected[0] <= path.from && selected[1] >= path.to || path.from <= selected[0] && path.to >= selected[1] || path.from >= selected[0] && path.from <= selected[1] || path.to >= selected[0] && path.to <= selected[1];
		};
		
		var combineCoords = function (paths) {
			var coords = [];
			for(var i = 0;i<paths.length;i++) {
				coords = coords.concat(paths[i].path);
			}
			return coords;
		};
		
		var generateMarker = function(point) {
			markers.push({
				'coords':point, 
				'style': character.markerStyle, 
				'character':character
			});
		};
		
		for(var id in loadedCharacters) { // Loop through every character
			var character = loadedCharacters[id];
			if(!character.shown) {
				continue;
			}
			if(character.pathInfo) {
				var paths = character.path.filter(pathShown);
				polylines.push({
					path: combineCoords(paths),
					color: character.color,
					character: character
				});
				var len = paths.length;
				if(len !== 0) {
					var firstPath  = paths[0];
					var firstPoint = firstPath.path[0];
					markers.push({
						'coords': firstPoint,
						'style': firstPath.alive ? character.markerStyle : character.deadStyle,
						'character':character
					});
				}
				if(len > 1) {
					var lastPath  = paths[len-1];
					var lastPoint = lastPath.path[lastPath.path.length-1];	
					markers.push({
						'coords': lastPoint,
						'style': lastPath.alive ? character.markerStyle : character.deadStyle,
						'character':character
					});
				}
			} else {
				character.points.map(generateMarker);
			}
		}/*
		markers.sort(function (marker1, marker2) {
			var c1 = marker1.coords;
			var c2 = marker2.coords;
			var dif = c1[0] - c2[0];
			if(dif == 0) {
				return c1[1] - c2[1]
			} else {
				return dif;
			}
		});
		var lastMarker = {coords:[0,0]};
		markers = markers.filter(function (marker) {
			var lastCoords = (typeof lastMarker[0] == "array") ? lastMarker[0].coords : lastMarker.coords;
			if(lastMarker && marker.coords[0] == lastCoords[0] && marker.coords[1] == lastCoords[1]) {
				if(typeof lastMarker != "array") {
					lastMarker = [lastMarker];
				}
				lastMarker.push(marker);
				return false;
			}
			lastMarker = marker;
			return true;
		});*/
		markers.map(function(marker) {
			if(typeof marker == "object") {
				L.marker(marker.coords, {icon:marker.style}).addTo(characterLayer).character = marker.character;
			} else {
				L.marker(marker[0].coords).addTo(characterLayer).character = marker[0].character;
			}
		});
		polylines.map(function(polyline) {
			L.polyline(polyline.path, {color:polyline.color}).addTo(characterLayer).character = polyline.character;
		});
	};
	
	// Realms Functions
	
	/*
	 * showRealms
	 * 
	 * Shows the realm layer
	 * Switches betwenn the political map and the maps with the different colors
	 * @TODO Options
	 *
	 * @return realmsShown
	 */
	publicFunctions.showRealms = function() {
		if(!realmsColored) {
			map.addLayer(colorlessLayer);
			realmsColored = true;
		} else {
			map.removeLayer(colorlessLayer);
			map.addLayer(realmsLayer);
			realmsShown = true;
			realmsColored = false;
		}
		return realmsShown;
	};
	
	/*
	 * hideRealms
	 * 
	 * Hide the realm layer
	 *
	 * @return realmsShown
	 */
	publicFunctions.hideRealms = function() {
		if(realmsShown) {
			map.removeLayer(realmsLayer);
			realmsShown = false;
			return realmsShown;
		}
	};		
				
	/*	
	 * toggleRealms
	 * 
	 * Invokes show/hide realm depending on realmsShown
	 *
	 * @return realmsShown
	 */
	publicFunctions.toggleRealms = function() {
		return realmsShown ? publicFunctions.hideRealms() : publicFunctions.showRealms();
	};
	
	// Credits
	
	/*
	 * credit
	 * 
	 * Show Team Members
	 *
	 * @return ourNames
	 */
	publicFunctions.getCredits = function() {
		return "GotMap by Maximilian Bandle @mbandle, Alexander Beischl @AlexBeischl, Tobias Piffrader @tpiffrader";
	};
	
	return publicFunctions;
};