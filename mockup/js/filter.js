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
		l.css('display', 'block');
	});
	f.focusout(function () {
		l.css('display', 'none');
	});
	f.keyup(function() {
		$('#filter-dropdown').append('<li><a href="#">'+f.val()+'</a></li>');
	});
	
});