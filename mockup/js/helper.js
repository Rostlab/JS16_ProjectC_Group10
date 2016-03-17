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
		
			c.layer = new L.layerGroup();
			c.markerStyle =  mapHelpers.colorMarker(c.color, img);
			c.markers = [];
			c.polyline =  L.polyline([], {color: c.color}).addTo(c.layer);
			c.layer.addTo(map);
			
		}
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
			}
		}
	}
};