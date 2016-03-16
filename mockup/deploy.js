	var config =  function(params) {
		apiLocation = params.apiLocation;
		apiToken = params.apiToken;
	}
	var init = function() {
		//no jquiery or bootstrap included
		require("./lib/jquery-ui.min.js")

		//include css files + images
		require("./css/leaflet.css")
		require("./css/main.css")

		//include libraries
		require("./lib/leaflet.js")
		require("./lib/label.js")
		require("./lib/leaflet.label/BaseMarkerMethods.js")
		require("./lib/leaflet.label/FeatureGroup.Label.js")
		require("./lib/leaflet.label/Map.Label.js")
		require("./lib/leaflet.label/Marker.Label.js")
		require("./lib/leaflet.label/Path.Label.js")

		//data
		require("../data/characters.js")
		require("../data/cities.js")
		require("../data/episodes.js")
		require("../data/paths.js")

		// include js files
		require("./js/helper.js")
		require("./js/map.js")
		require("./js/filter.js")
		require("./js/timeline.js")
	}