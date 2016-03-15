
require('expose?$!expose?jQuery!jquery');
require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../node_modules/bootstrap/dist/js/bootstrap.min.js");
require("./lib/jquery-ui.min.js");

//html
//require("html!./mockup.html");

//include css files + images
require("./css/leaflet.css");
require("./css/main.css");

//include libraries
require("./lib/leaflet.js");
require("./lib/label.js");
require.context("./lib", true, /\.js$/);
require("./lib/leaflet.label/BaseMarkerMethods.js");
require("./lib/leaflet.label/FeatureGroup.Label.js");
require("./lib/leaflet.label/Map.Label.js");
require("./lib/leaflet.label/Marker.Label.js");
require("./lib/leaflet.label/Path.Label.js");

// include js files
require("./js/filter.js");
require("./js/helper.js");
require("./js/map.js");
require("./js/timeline.js");