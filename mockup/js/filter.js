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
	var selected = 0;
	var inputVal = "";
	var mouseOn = false;
	var cs = {};
	jQuery.get('https://got-api.bruck.me/api/characters/',null,function(data) {
		cs = data;
	});
	
	f.focusin(function () {
		l.fadeIn();
	});
	l.mouseenter(function() {
		mouseOn = true;
	});
	l.mouseleave(function() {
		mouseOn = false;
	});
	f.focusout(function () {
		if(!mouseOn) {
			l.fadeOut();
		}
	});
	f.keydown(function (e) {
		var key = e.keyCode;
		if(key == 13 || key == 38 || key == 40) {
			var list = l.find("li");
			e.preventDefault();
			$(list[selected]).removeClass('hover');
			switch(key) {
				case 13: // Return
					$(list[selected]).trigger('click');
					f.trigger('blur');
					selected = 0;
					return;
				case 38: // Up
					if(selected > 0) {
						selected--;
					}
					break;
				case 40: // Down
					if(selected < list.length) {
						selected++;
					}
			}
			$(list[selected]).addClass('hover');
		}
	});
	f.keyup(function(e) {
		var s = f.val().toLowerCase();
		if(s == inputVal) {
			return;
		} 
		inputVal = s;
		selected = 0;
		var maxResults = 25;
		var o1 = []; // Beginnt mit
		var o2 = []; // Ist enthalten
		var p;
		for(var i = 0;i<cs.length;i++) {
			p=cs[i];
			var pos = p.name.toLowerCase().indexOf(s);
			if(pos != -1) {
				(pos === 0 ? o1 : o2).push(p);
				if((maxResults--) === 0) {
					break;
				}
			}
		}
		var out = o1.concat(o2); // First beginning with e, then the rest
		l.empty(); // Delete the List
		if(out.length) {
			out.map(function(c,i) {
				var img;
				if(personList[c._id]) {// Image defined or use default
					img = personList[c._id].img;
				} else {
					img = defaultPersonImage;
				}
				var item = jQuery('<li><a href="#"><img src="'+img+'" class="img-circle"/>'+c.name+'</a></li>').click(function(e) {
					mapHelpers.addCharacter(c);
					l.fadeOut();
					return false;
				});
				if(i === 0) {
					item.addClass('hover');
				}
				l.append(item);
			});
		} else {
			l.append('<li class="dropdown-header">Nothing found</li>');
		}
	});
});