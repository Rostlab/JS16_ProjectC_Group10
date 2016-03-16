require('expose?$!expose?jQuery!jquery')
		require("../node_modules/bootstrap/dist/css/bootstrap.min.css")
		require("../node_modules/bootstrap/dist/js/bootstrap.min.js")
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