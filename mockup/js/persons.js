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
	personList.map(function(p,i){
		var img = p.img || defaultPersonImage;
		color = colors[i%colors.length];
		$("#persons").append('<div class="person disabled" id="person'+i+'"><img src="'+img+'"'+
			' class="img-circle" style="border-color:'+color+'"/>'+
			'<div class="personinfo"><div class="name">'+p.name+'</div>'+
			'<div class="house">'+p.house+'</div></div></div>');
		$("#person"+i).click(function (e) {
			var el = $(e.target);
			if(!el.hasClass('person')) {
				el = el.parents('.person');
			}
			el.toggleClass('disabled');
		});
	});
			
});