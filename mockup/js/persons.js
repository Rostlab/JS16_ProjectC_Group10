/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function() {
	var defaultImage = 'img/persons/dummy.jpg';
	var persons = [
	{name:'Eddard Stark', img:'img/persons/edd.jpg', house:'House Stark'},
	{name:'Robb Stark', img:'img/persons/robb.jpg', house:'House Stark'},
	{name:'Sansa Stark', img:'img/persons/sansa.jpg', house:'House Stark'},
	{name:'Arya Stark', img:'img/persons/arya.jpg', house:'House Stark'},
	{name:'Brandon Stark', img:'img/persons/bran.jpg', house:'House Stark'},
	{name:'Rickon Stark', img:'img/persons/rickon.jpg', house:'House Stark'},
	{name:'Jon Snow', img:'img/persons/jon.jpg', house:'House Stark'},
	{name:'Daenerys Targaryen', img: 'img/persons/daenerys.jpg', house:'House Targaryen'},
	{name:'Tywin Lannister', img:'', house:'House Lannister'},
	{name:'Jaime Lannister', img:'', house:'House Lannister'},
	{name:'Cersei Lannister', img:'', house:'House Lannister'},
	{name:'Tyrion Lannister', img:'', house:'House Lannister'}
	];
	var colors = ['#FFA000', '#F57C00', '#CDDC39', '#8BC34A', '#D32F2F', '#536DFE', '#512DA8', '#009688', 
		'#03A9F4', '#795548', '#E91E63', '#FF5722'];
	persons.map(function(p,i){
		var img = p.img || defaultImage;
		color = colors[i%colors.length];
		$("#persons").append('<div class="person"><img src="'+img+'" class="img-circle" '+
			'style="border-color:'+color+'"/>'+
			'<div class="personinfo"><div class="name">'+p.name+'</div>'+
			'<div class="house">'+p.house+'</div></div></div>');
	});
			
});