/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
    var path = {};
    var polyline = L.polyline([], {
        color: 'red'
    }).addTo(map);
    var dot = L.divIcon({
        className: 'point'
    });
    var selected = "0-1";

    // Back Button
    var backCtrl = L.Control.extend({
        options: {
            position: 'topright'
        },
        onAdd: function(map) {
            var c = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom glyphicon glyphicon-arrow-left');
            L.DomEvent.disableClickPropagation(c);
            c.onclick = function() {
                path[selected].pop();
                polyline.setLatLngs(toCoords(path));
            };
            return c;
        },
    });
    map.addControl(new backCtrl());

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

	jQuery.get("../data/cities.js", {}, function(data)
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
        		}).bindLabel(place.name, 
        			{
					direction: 'auto'
        			}).addTo(map);
        	}
    	});
    });

    function addToPolyline(c, info) {
        if(!path[selected]) {
	        path[selected] = [];
        }
        if (info) {
            path[selected].push([c.lat, c.lng, info]);
        } else {
            path[selected].push([c.lat, c.lng]);console.log(path[selected]);
        }
        polyline.setLatLngs(toCoords(path));
    }

    map.on("click", function(e) {
        addToPolyline(e.latlng);
    });

    $("#slider-range").slider({
        range: true,
        min: 1,
        max: 50,
        values: [1, 2],
        slide: function(event, ui) {
            selected = [ui.values[0], ui.values[1]];
            if (selected[0] == selected[1]) {
                selected = selected[0];
            } else {
	            selected = selected[0] +"-"+ selected[1];
            }
            $("#amount").text(getEpisodeInfo(ui.values[0]) + " - " + getEpisodeInfo(ui.values[1]));
        }
    });

	function toCoords(px) {
		var cs = [];
		var getC = function(p) {
			cs.push([p[0], p[1]]);
		};
		for(var k in px) {
			px[k].map(getC);
		}
		return cs;
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
