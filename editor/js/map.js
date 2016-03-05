/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
    L.CRS.CustomZoom = L.extend({}, L.CRS.EPSG3857, {
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
    var map = L.map(document.getElementById('map'), {
        tapTolerance: 20,
        crs: L.CRS.CustomZoom
    });
    var bounds = new L.LatLngBounds(L.latLng(85,-180), L.latLng(-43.85, 171.34));


    map.options.mapBounds = bounds;
    map.fitBounds(bounds);
    map.setMaxBounds(bounds);
    
    var r = new L.tileLayer("https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/{z}/y{y}x{x}.png", {
        minZoom: 0,
        maxZoom: 5,
        bounds: bounds,
        errorTileUrl: 'https://raw.githubusercontent.com/Rostlab/JS16_ProjectC_Group10/develop/tiles/blank.png',
        noWrap: true,
        attribution: 'Tiles &copy; <a href="http://viewers-guide.hbo.com">HBO</a>'
    });
    map.addLayer(r);
	
	markers = new L.layerGroup();
	cityMarkers = [];
	map.addLayer(markers);
	
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
	
	$('#sidebar').append('<ul></ul>');
	ul = $('#sidebar ul');
	gotDB.getAll().map(function(city, i) {
		var x = "";
		if(city.coord) {
			addMarker(city, i);
        	x = ' class="onmap"';
		}
		var li = $('<li'+x+'>'+city.name+'</li>').click(function () {
			gotDB.setCurrent(i);
		});
		ul.append(li);
	});
	
	function addMarker(city, i) {
		cityMarkers[i] = new L.marker(city.coord, {
            	draggable: 'true'
        }).bindPopup(function() {
	        return makePopup(city, i)
        }).on('click', function() {
	        gotDB.setCurrent(i);
        }).addTo(markers);
	}
	
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
	
    function onMapClick(e) {
	    if(curCity == -1) {
		    return;
	    }
	    var city = cityInfo[curCity];
	    var marker = cityMarkers[curCity];
	    if(marker) {
		    marker.setLatLng(e.latlng);
	    } else {
		    var marker = cityMarkers[curCity] = new L.marker(e.latlng, {
            	draggable: 'true'
        	}).bindPopup().addTo(markers);
	    }
        var position = e.latlng;
	    city.coord = [position.lat, position.lng];
        marker.setPopupContent("<h4>"+city.name+'</h4><button type="button" class="btn btn-danger" '+
        	'onclick="">Don\'t Save</button><button type="button" class="btn btn-success" '+
        	'>Save</button>').openPopup();
        marker.on('dragend', function(event) {
            var position = marker.getLatLng();
			city.coord = [position.lat, position.lng];
			marker.openPopup();
        });
    }
    map.on('click', onMapClick);
});