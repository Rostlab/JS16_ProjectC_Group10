module.exports = {
	config:  function(params) {
		apiLocation = params.apiLocation;
		apiToken = params.apiToken;
	},
	init: function() {
		require("./builds/deploy.bundle.js");
	},
	demo: function() {
		require("./builds/demo.bundle.js");
	}
}


