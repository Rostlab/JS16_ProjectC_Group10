/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
	var selected = "0-1";
	
	var es = episodes; // Get them from the DB later
	
	$("#episodes").text(getEpisodeInfo(0) + " - " + getEpisodeInfo(1)); // Initialize it
	
	$("#episode-slider").slider({
        range: true,
        min: 0,
        max: es.length-1,
        values: [0, 1],
        animate: "slow",
        slide: function(event, ui) {
            selected = [ui.values[0], ui.values[1]];
            if (selected[0] == selected[1]) {
                selected = selected[0];
            } else {
	            selected = selected[0] +"-"+ selected[1];
            }
            $("#episodes").text(getEpisodeInfo(ui.values[0]) + " - " + getEpisodeInfo(ui.values[1]));
            mapHelpers.updatePaths(selected);
        }
    });
    
    function getEpisodeInfo(i) {
	    if(i < es.length) {
        	return "S" + es[i].season + "E" + es[i].episode + ": " + es[i].title;
        } else {
	        return "No Episode found";
        }
    }
});