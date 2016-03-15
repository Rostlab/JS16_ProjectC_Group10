require('expose?$!expose?jQuery!jquery');
require("../node_modules/bootstrap/dist/css/bootstrap.min.css");
require("../node_modules/bootstrap/dist/js/bootstrap.min.js");
require("./lib/jquery-ui.min.js");

//html
require("html!./mockup.html");

//include css files + images
require("./css/leaflet.css");
require("./css/main.css");

//include libraries
require("./lib/leaflet.js");
require("./lib/label.js");
require.context("./lib", true, /\.js$/);

// include js files
require.context("./js", false, /\.js$/);

