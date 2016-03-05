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
		color = colors[i%colors.length]; // Iterate through the colors
		// Make new elem
		var item = $('<div class="person disabled" id="person'+i+'"><img src="'+img+'"'+
			' class="img-circle" style="border-color:'+color+'"/>'+
			'<div class="personinfo"><div class="name">'+p.name+'</div>'+
			'<div class="house">'+p.house+'+
			'<div class="container">
			<a href="#" title="Dismissible popover" data-toggle="popover" data-trigger="focus" data-content="Coming soon...">Click me</a> 
			</div></div></div></div>');
		
		
		<script>
		$(document).ready(function(){
    		$('[data-toggle="popover"]').popover();   
		});
		</script>
		item.click(function (e) { // Bind the click listener
			var el = $(e.target); // Clicked Element
			if(!el.hasClass('person')) {
				el = el.parents('.person'); // Get the container	
			}
			el.toggleClass('disabled'); // Toggle the class name (de-)activate it
		});
		$("#persons").append(item);// Add it to the list
	});	
});