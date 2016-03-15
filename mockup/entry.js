
require('expose?$!expose?jQuery!jquery')
require("../node_modules/bootstrap/dist/css/bootstrap.min.css")
require("./lib/jquery-ui.min.js")
require("../node_modules/bootstrap/dist/js/bootstrap.min.js")

//html
require("html!../map.html")

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

// include js files
require("./js/helper.js")
require("./js/map.js")
require("./js/filter.js")
require("./js/timeline.js")