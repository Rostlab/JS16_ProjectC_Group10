/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
var mapHelpers = {
	// Launch wiki informations
	wikiModal: function (link, title, cssclass) {
		$('#dynModal').modal('show');// Show the Modal
    	var tEl = $('#dynModal .modal-header'); // Header Container
		var bEl = $('#dynModal .modal-body'); // Body Container
		
		if (title) { // If there is a title
			tEl.show(); // Show the Bar and FIll it
			$('#dynModalLabel').text(title);
			if(cssclass) {
				tEl.addClass(cssclass);
			}
		} else {
			tEl.hide(); // Hide it
		}
		
		// Show Spinner
		bEl.html("<span class='glyphicon glyphicon-cog glyph-spin glyph-big'></span>").addClass('text-center'); 
		
		var cEl = $('#dynModal .modal-footer .classes').empty(); // Classes Container
		$('#dynModal .wikilink').attr('href', link); // Update the Wiki-Link
		
		// Get the wiki
		jQuery.ajax({
			url: link 
		}).success(function(x) { // Show it
			var content = $(x).find("#bodyContent");
			bEl.removeClass('text-center'); // Make it left aligned
			content.find("img").each(function (i, el) { // FIx the image URL
				el.src = "http://awoiaf.westeros.org"+el.src.substr(el.src.indexOf("/i"));
			});
			content.find("a").each(function (i, el) { // Fix the links
				if(el.href.indexOf("/i") !== -1)
				{
					el.href = "http://awoiaf.westeros.org"+el.href.substr(el.href.indexOf("/i"));
					el.target = "_blank";
				}
			});
			content.find(".catlinks li a").each(function (i, el) { // Pull the catlinks in the modal footer
				$(el).addClass("btn").addClass("btn-default").addClass("pull-left");
				cEl.append(el);
			});
			bEl.html(content);
		}).error(function () { // Display Error Message
			bEl.html("<span class='glyphicon glyphicon-alert glyph-big text-danger'></span>");
		});
	},
	
	// Set Pins
	characterPins: function (character) {
		var marker = mapHelpers.colorMarker(character.color, character.img);
		L.marker([Math.random()*120-35, Math.random() * 360 -180], {icon:marker}).addTo(map);
		L.marker([Math.random()*120-35, Math.random() * 360 -180], {icon:marker}).addTo(map);
		L.marker([Math.random()*120-35, Math.random() * 360 -180], {icon:marker}).addTo(map);
	}, 
	
	// Make some colorful markers
	colorMarker: function(color, imgSrc) {
		var img = imgSrc ? '<img src="'+imgSrc+'" />' : '';
		return L.divIcon({
	    	className: 'colormarker',
	    	html:'<span class="glyphicon glyphicon-map-marker" style="color:'+color+';">'+img+'</span>'
		});
	},
	characters: {},
	
	colors: ['#FFA000', '#F57C00', '#CDDC39', '#8BC34A', '#D32F2F', '#536DFE', '#512DA8', '#009688', 
		'#03A9F4', '#795548', '#E91E63', '#FF5722'],
		
	// Add a character to the list
	addCharacter: function(c) {
		if(!this.characters[c.id]) { // If not in the list, add it
			var count = Object.keys(this.characters).length; // # of Characters
			c.color = this.colors[count % this.colors.length]; // Rotate the colors
			var img = c.img || defaultPersonImage; // Image defined or use default
			// Make new elem
			var item = $('<div class="character"><img src="'+img+'"'+
				'class="img-circle" style="border-color:'+c.color+'"/>'+
				'<div class="characterinfo"><div class="name">'+c.name+'</div>'+
				'<div class="house">'+c.house+'</div></div></div></div>');
		
			item.click(function (e) { // Bind the click listener
				var el = $(e.target); // Clicked Element
				if(!el.hasClass('character')) {
					el = el.parents('.character'); // Get the container
				}
				el.toggleClass('disabled'); // Toggle the class name (de-)activate it
				mapHelpers.characterPins(c);
			});
			mapHelpers.characterPins(c); // Show the character pins
			$("#characters").append(item);// Add it to the list
			c.el = item;
			this.characters[c.id] = c; // Save it
		}
	}	
};