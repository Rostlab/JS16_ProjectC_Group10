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
		s.map(function(p) {
			var img = p.img || defaultPersonImage;
			var item = jQuery('<li><a href="#"><img src="'+img+'" class="img-circle"/>'+p.name+'</a></li>').click(function(e) {
				$('#person'+p.index).trigger('click', {target:$('#person'+p.index)});
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
		var s = f.val().toLowerCase();
		var o1 = []; // Beginnt mit
		var o2 = []; // Ist enthalten
		personList.map(function(p,i) {
			var pos = p.name.toLowerCase().indexOf(s);
			if(pos != -1) {
				p.index = i;
				(pos === 0 ? o1 : o2).push(p);
			}
		});
		return o1.concat(o2);
	}
});