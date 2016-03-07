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
	
	$("#amount").text(getEpisodeInfo(0) + " - " + getEpisodeInfo(1));
	
	$("#slider-range").slider({
        range: true,
        min: 0,
        max: 49,
        values: [0, 1],
        animate: "slow",
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
    
        function getEpisodeInfo(i) {
        var e = episodes[i];
        return "S" + e.season + "E" + e.episode + ": " + e.title;
    }
});