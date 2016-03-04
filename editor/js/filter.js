/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function () {
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
	function search() {
		var s = f.val().toLowerCase();
		var o1 = []; // Beginnt mit
		var o2 = []; // Ist enthalten
		personList.map(function(p) {
			var pos = p.name.toLowerCase().indexOf(s);
			if(pos != -1) {
				(pos === 0 ? o1 : o2).push(p);
			}
		});
		return o1.concat(o2);
	}
	cityInfo = []; // name, coord, type
	curCity = -1;
	var cityList = ["Ashemark", "Astapor", "Bear Island", "Braavos, Free City", "Brightwater Keep", "Casterly Rock", "Castle Black", "Castle Cerwyn", "Clegane's Keep", "Cornfield", "Crakehall", "Craster's Keep", "Crownlands", "Deep Lake", "Dorne", "Dothraki Sea", "Dragonstone", "Eyrie", "Fist of the First Men", "Frostfang Mountains", "Hardhome", "Harrenhal", "Highgarden", "Hornwood", "Inn at the Crossroads", "Karhold", "King's Landing", "Last Hearth", "Lys, Free City", "Maidenpool", "Meereen", "Moat Cailin", "Mole's Town", "Myr, Free City", "Nightsong", "Oldtown", "Pentos, Free City", "Pyke", "Qarth", "Raventree Hall", "Red Waste", "Riverrun", "Runestone", "Seagard", "Stone Hedge", "Stonehelm", "Storm's End", "Summerhall", "Sunspear", "The Arbor", "The Bloody Gate", "The Crag", "The Dreadfort", "The Gift", "The Golden Tooth", "The Nightfort", "The Ruby Ford", "The Trident", "The Twins", "The Vale of Arryn", "The Whispering Wood", "The Whispers", "Torrhen's Square", "Tyrosh, Free City", "Vaes Dothrak", "Valyria", "Village of the Lhazareen", "Volantis, Free City", "Winterfell", "Yunkai"];
	$('#sidebar').append('<ul></ul>');
	ul = $('#sidebar ul');
	cityList.map(function(city, i) {
		cityInfo.push({name:city});
		var li = $('<li>'+city+'</li>').click(function () {
			curCity = i;
		});
		ul.append(li);
	});
});