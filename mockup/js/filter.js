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
	var cs = {};
	jQuery.get('https://got-api.bruck.me/api/characters/',null,function(data) {
		cs = data;
	});
	
	f.focusin(function () {
		l.fadeIn();
	});
	f.focusout(function () {
		// l.hide();
	});
	f.keyup(function() {
		var s = search();
		l.empty();
		if(s.length) {
		s.map(function(c) {
			var img;
			if(personList[c._id]) {// Image defined or use default
				img = personList[c._id].img;
			} else {
				img = defaultPersonImage; 
			}
			var item = jQuery('<li><a href="#"><img src="'+img+'" class="img-circle"/>'+c.name+'</a></li>').click(function(e) {
				// $('#person'+p.index).trigger('click', {target:$('#person'+p.index)});
				mapHelpers.addCharacter(c);
				l.fadeOut();
				return false;
			});
			l.append(item);
		});
		} else {
			l.append('<li class="dropdown-header">Nothing found</li>');
		}
	});
	function search() {
		var maxResults = 20;
		var s = f.val().toLowerCase();
		var o1 = []; // Beginnt mit
		var o2 = []; // Ist enthalten
		var p;
		for(var i = 0;i<cs.length;i++) {
			p=cs[i];
			var pos = p.name.toLowerCase().indexOf(s);
			if(pos != -1) {
				(pos === 0 ? o1 : o2).push(p);
				if((maxResults--) !== 0) {
					break;
				}
			}
		}
		return o1.concat(o2);
	}
});