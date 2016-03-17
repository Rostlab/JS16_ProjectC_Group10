/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
var mapHelpers = {
	// Set Pins
	characterPins: function (character) {
		var marker = mapHelpers.colorMarker(character.color, character.img);
	}, 
	
	// Make some colorful markers
	colorMarker: function(color, imgSrc) {
		var img = imgSrc ? '<img src="'+imgSrc+'" />' : '';
		return L.divIcon({
	    	className: 'colormarker',
	    	html:'<span class="glyphicon glyphicon-map-marker" style="color:'+color+';">'+img+'</span>'
		});
	},
		
	// Add a character to the list
	addCharacter: function(c) {
		if(!this.characters[c.name]) { // If not in the list, add it
			var count = Object.keys(this.characters).length; // # of Characters
			c.color = this.colors[count % this.colors.length]; // Rotate the colors
			var img;
			if(personList[c.name]) {// Image defined or use default
				img = personList[c.name].img;
			} else {
				img = defaultPersonImage; 
			}
			
			// Make new elem
			var character = $('<div class="character"><img src="'+img+'"'+
				'class="img-circle" style="border-color:'+c.color+'"/></div>');
			var charInfo = $('<div class="characterinfo"></div>');
			var name = $('<div class="name">'+c.name+'</div>');
			var house = $('<div class="house">'+c.house+'</div>');
			var moreInfo = $('<a>More info</a>');
			var deleteButton = $('<span class="delete glyphicon glyphicon-remove"></span>');
		
			mapHelpers.characterPins(c); // Show the character pins
			$("#characters").append(character);// Add it to the list
			character.append(charInfo);
			charInfo.append(name);
			if(c.house){
				charInfo.append(house);
			}
			charInfo.append(moreInfo);
			charInfo.append(deleteButton);
			c.layer = new L.layerGroup();
			c.markerStyle =  mapHelpers.colorMarker(c.color, img);
			c.markers = [];
			c.polyline =  L.polyline([], {color: c.color}).addTo(c.layer);
			c.layer.addTo(map);
			
			character.click(function (e) { // Bind the click listener
				var el = $(e.target); // Clicked Element
				if(!el.hasClass('character')) {
					el = el.parents('.character'); // Get the container
				}
				if(el.hasClass('disabled')) { // Toggle the class name (de-)activate it
					el.removeClass('disabled');
					c.layer.addTo(map);
				} else {
					el.addClass('disabled');
					c.layer.remove();
				}
				mapHelpers.characterPins(c);
			});
			var this2= this;
			deleteButton.click(function (e) {
				this2.deleteCharacter(c.name);
				return false;
			});
			
			moreInfo.click(function (e) {
				var el = $(e.target);
				this2.wikiModal("http://awoiaf.westeros.org/index.php/"+c.name, c.name, "person "+(c.house ? c.house.toLowerCase() : ''));
				return false; // Prevent Default + Bubbling
			});
			
			c.el = character;
			this.characters[c.name] = c; // Save it
			this.updatePaths();
		}
	},
	
	deleteCharacter: function(n) {
		if(this.characters[n]) {
			var c = this.characters[n];
			c.el.remove();
			c.layer.remove();
			delete this.characters[n];
			return true;
		}
		return false;
	},
	
	selection: [0,1],
	
	// display the selected paths
	updatePaths: function(selection) {
		var toArray = function(s) { // make e.g. "1-3" to [1,3]
			if(typeof s == "number") {
				return s;
			}
			s = s.split('-');
			return [parseInt(s[0]), parseInt(s[s.length-1])];
		};
		var sel = this.selection = selection ? toArray(selection) : this.selection; // Perform it on the slider input
		
		var displayIt = function(pathInfo) { // Check whether to display the path
			if(pathInfo == "death") {return false;}
			var p = toArray(pathInfo);
			if(p.length == 1) {
				return (p[0] >= sel[0] && p[0] <= sel[1]);
			}
			return (p[0] >= sel[0] && p[1] <= sel[1]);
		};
	
		var getC = function(p) { // get Coordinates
			cs.push([p[0], p[1]]);
		};
		
		var callbackSuccess = function(data) {
			var re = /index\.php\/([^"?]+)/g; // Find Link
			var m;
 
			while ((m = re.exec(data)) !== null) {
				if (m.index === re.lastIndex) {
					re.lastIndex++;
				}
				var place = cityList[m[1].replace('_', ' ')];
				if(place) {
					c.markers.push(L.marker([parseFloat(place.coordY), parseFloat(place.coordX)], {icon:c.markerStyle}).addTo(c.layer));
				}
			}
		};
		for(var k in this.characters) { // Check if path exists and display
			var c = this.characters[k];
			if(paths[k]) { // If there is path info
				var cs = []; // Collect the Coordinates
				for(var k2 in paths[k]) {
					if(displayIt(k2)) {
						paths[k][k2].map(getC);
					}
				}
				c.polyline.setLatLngs(cs);
				var start = cs.shift(); // Get the first
				if(c.markers.length === 0) {
					c.markers.push(L.marker([0,0], {icon:c.markerStyle}).addTo(c.layer));
					c.markers.push(L.marker([0,0], {icon:c.markerStyle}).addTo(c.layer));
					c.markers.push(L.marker([0,0], {icon:mapHelpers.colorMarker(c.color, deadImage)}).addTo(c.layer));
				}
				if(paths[k].death) {
					var d = paths[k].death;
					if(d[2] <= sel[1]) { // Last marker is dead
						c.markers[1].remove();
						c.markers[2].addTo(c.layer);
					} else {
						c.markers[1].addTo(c.layer);
						c.markers[2].remove();
					}
				}
				
				if(cs.length !== 0) {
					c.markers[0].setLatLng(start).addTo(c.layer); // Display start Marker
					c.markers[1].setLatLng(cs.length > 0 ? cs.pop() : start); // Display End Marker
					c.markers[2].setLatLng(cs.length > 0 ? cs.pop() : start); // Display End Marker
				} else {
					c.markers[0].remove();
				}
			} else if(c.markers.length === 0) { // When nothing is there we have to set some 
				jQuery.ajax({url:"http://awoiaf.westeros.org/index.php/"+c.name}).success(callbackSuccess);
			}
		}
	}
};