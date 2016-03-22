/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
	cityMarkers = [];
	// Edit Button
	var editCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-edit');
			L.DomEvent.disableClickPropagation(c);
			c.onclick = function(){
				if(gotDB.curCity == -1) {
					alert("Please select city");
				} else {
					$('#editModal').modal('show');
				}
			};
			return c;
		},
	});
	map.addControl(new editCtrl());
	
	// Save to JSON Button
	var jsonCtrl = L.Control.extend(
	{
		options: {position: 'topright'},
		onAdd: function (map) {
			var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-share');
			L.DomEvent.disableClickPropagation(c);
			c.onclick = function(){
				$('#jsonModal').modal('show');
				$('#jsonArea').val(JSON.stringify(gotDB.getAll()));
			};
			return c;
		},
	});
	map.addControl(new jsonCtrl());
	
	
	// BEGIN FILTER PART
	
	var f = $('#filter input'); // Filter Element
	var l = $('#filter-dropdown'); // Dropdown
	f.keyup(function() {
		var s = f.val().toLowerCase();
		$('#sidebar li').each(function(i, el) {
			el = $(el);
			if(el.text().toLowerCase().indexOf(s) == -1) {
				el.hide();
			} else {
				el.show();
			}
		});
	});
	
	function addMarker(city, i) {
		cityMarkers[i] = new L.marker([city.coordY, city.coordX], {
            	draggable: 'true'
        }).bindPopup(function() {
	        return makePopup(city, i);
        }).on('click', function() {
	        gotDB.setCurrent(i);
        }).addTo(markers);
	}
	
	$('#sidebar').append('<ul></ul>');
	ul = $('#sidebar ul');
	jQuery.get("https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/data/cities.js", {},  // Static Link
	// jQuery.get("https://got-api.bruck.me/api/cities", {},
		function (allCities){
			JSON.parse(allCities).map(function (city,i) {var x = "";
		if(city.coordX) {
			addMarker(city, i);
        	x = ' class="onmap"';
		}
		var li = $('<li'+x+'>'+city.name+'</li>').click(function () {
			gotDB.setCurrent(i);
		});
		ul.append(li);
			});
	});
	
	function makePopup(city, i) {
		var c = $('<div><h4>'+city.name+'</h4></div>');
		c.append($('<button type="button" class="btn btn-danger">Don\'t Save</button').click(function() {
			cityMarkers[i].setLatLng(gotDB.getCurrent().coord);
		}));
		c.append($('<button type="button" class="btn btn-warning">Bearbeiten</button').click(function() {
			$('#editModal').modal('show');
		}));
		c.append($('<button type="button" class="btn btn-success">Save</button').click(function() {
			gotDB.updateCurrent({"coord":cityMarkers[i].getLatLng()});
			cityMarkers[i].closePopup();
		}));
		return c.get(0);
	}
	
	$('#editModal').on('show.bs.modal', function () {
		var city = gotDB.getCurrent();
		$('#name').val(city.name || "");
		$('#type').val(city.type || "others");
		$('#prio').val(city.prio || "6");
	});
	
	$('#saveEditModal').click(function () {
		gotDB.updateCurrent({
			"name":$('#name').val(),
			"type":$('#type').val(),
			"prio":$('#prio').val()
		});
	});
});