/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
var mapHelpers = {
	wikiModal: function (link, title, cssclass) {
		$('#dynModal').modal('show');
    	var tEl = $('#dynModal .modal-header'); // Header Container
		var bEl = $('#dynModal .modal-body'); // Body Container
		
		if (title) { // Fill or Hide
			tEl.show();
			$('#dynModalLabel').text(title);
			if(cssclass) {
				tEl.addClass(cssclass);
			}
		} else {
			tEl.hide();
		}
		
		bEl.html("<span class='glyphicon glyphicon-cog glyph-spin glyph-big'></span>").addClass('text-center'); // Spinner
		
		var cEl = $('#dynModal .modal-footer .classes').empty(); // Classes Container
		$('#dynModal .wikilink').attr('href', link);
		
		jQuery.ajax({
			url: link
		}).success(function(x) {
			var content = $(x).find("#bodyContent");
			bEl.removeClass('text-center');
			content.find("img").each(function (i, el) {
				el.src = "http://awoiaf.westeros.org"+el.src.substr(el.src.indexOf("/i"));
			});
			content.find("a").each(function (i, el) {
				if(el.href.indexOf("/i") !== -1)
				{
					el.href = "http://awoiaf.westeros.org"+el.href.substr(el.href.indexOf("/i"));
					el.target = "_blank";
				}
			});
			content.find(".catlinks li a").each(function (i, el) {
				$(el).addClass("btn").addClass("btn-default").addClass("pull-left");
				cEl.append(el);
			});
			bEl.html(content);
		}).error(function () {
			bEl.html("<span class='glyphicon glyphicon-alert glyph-big text-danger'></span>");
		});
	}
};