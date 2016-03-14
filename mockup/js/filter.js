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
	var selectedInDropdown = 0; // Index of highlighted Dropdown element
	var inputVal = ""; // Last used input
	var mouseOn = false; // Mouse over list?
	var focusOn = false; // Cursor in input?
	var cs = {}; // Character Store
	
	jQuery.get('https://got-api.bruck.me/api/characters/',null,function(data) {
		cs = data;
	});
	
	// Set events to know where the mouse is and do fading
	l.mouseenter(function() { // No need to fade in because it is already
		mouseOn = true;
	});
	l.mouseleave(function() {
		mouseOn = false;
		if(!focusOn) {
			l.fadeOut();
		}
	});
	
	// Set events to know where the cursor is and fade the list in/out
	f.focusin(function () {
		focusOn = true;
		l.fadeIn();
	});
	f.focusout(function () {
		focusOn = false;
		if(!mouseOn) {
			l.fadeOut();
		}
	});
	
	// Get the Return / UP / Down Keys early to prevent default beahvior
	f.keydown(function (e) {
		var key = e.keyCode;
		if(key == 13 || key == 38 || key == 40) {
			var lEl = l.find("li"); // All list elements
			e.preventDefault();
			if(key == 13) { // Return
					$(lEl[selectedInDropdown]).trigger('click');
					f.trigger('blur');
					selectedInDropdown = 0;
					return;
			}
			$(lEl[selectedInDropdown]).removeClass('hover');
			if(key == 38) { // Up
				if(selectedInDropdown > 0) {
					selectedInDropdown--;
				}
			} else { // Down
				if(selectedInDropdown < lEl.length) {
					selectedInDropdown++;
				}
			}
			$(lEl[selectedInDropdown]).addClass('hover'); // Add hover to the new el
		}
	});
	
	// Trigger the search 
	f.keyup(function(e) {
		var s = f.val().toLowerCase();
		if(s == inputVal) { // Only when sth new happens
			return;
		} 
		inputVal = s;
		selectedInDropdown = 0;
		var maxResults = 20;
		var o1 = []; // Begins with
		var o2 = []; // Contains
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
		l.empty(); // Delete the HTML li Elements
		if(out.length) {
			out.map(function(c,i) {
				var img;
				if(personList[c.name]) {// Image defined or use default
					img = personList[c.name].img;
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