/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
	var colors = ['#FFA000', '#F57C00', '#CDDC39', '#8BC34A', '#D32F2F', '#536DFE', '#512DA8', '#009688', 
		'#03A9F4', '#795548', '#E91E63', '#FF5722'];
	personList.map(function(p,i){ // For every person
		var img = p.img || defaultPersonImage; // Image defined or use default
		var color = colors[i%colors.length]; // Iterate through the colors
		// Make new elem
		var item = $('<div class="character disabled" id="character'+i+'" ><img src="'+img+'"'+
		'class="img-circle" style="border-color:'+color+'"/>'+
		'<div class="characterinfo"><div class="name">'+p.name+'</div>'+
		'<div class="house">'+p.house+'</div></div></div></div>');
		
    	// Fill the modals
		$('#dynModal').on('show.bs.modal', function (e) {
			var a = $(e.relatedTarget); // Make Short for Caller
			var t = a.attr('title'); // Title 
			var tEl = $('#dynModal .modal-header'); // Header Container
			if (t && tEl.show()) { // Fill or Hide
			 $('#dynModalLabel').text(t);
			} else {
			 tEl.hide();
			}
			
			var bEl = $('#dynModal .modal-body'); // Body Container
			bEl.html("<span class='fa fa-spin fa-cog fa-5x'></span>").addClass('text-center'); // Spinner
			bEl.load(a.attr('href'), function(r,c) {
			//TODO: funktion die es aus datenbank zieht muss noch geschrieben werden
				if(c!='error'){bEl.removeClass('text-center');} else {
					bEl.html("<span class='fa fa-exclamation-triangle fa-5x text-danger'></span>");
				}
			});// Load when URL
		});

		item.click(function (e) { // Bind the click listener
			var el = $(e.target); // Clicked Element
			if(!el.hasClass('character')) {
				el = el.parents('.character'); // Get the container
			//	$("#dynModal").modal("show");
			}
			el.toggleClass('disabled'); // Toggle the class name (de-)activate it
			mapHelpers.characterPins(p, color);
		});
		$("#characters").append(item);// Add it to the list
		
	});	
});