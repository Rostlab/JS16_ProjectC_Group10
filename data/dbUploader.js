/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/

var allCities = gotDB.getAll();

var i;

for(i = 0; i < allCities.length; i++)
{
	var city = allCities[i];
	
	jQuery.post("https://got-api.bruck.me/api/city", {
        name: city.name,
        coordX: city.coord.lng,
        coordY: city.coord.lat,
        type: city.type,
        priority: parseInt(city.prio),
        link: city.link
    },
    function(data) {
        chars = data;
        console.log(chars);
    });
	/*
	jQuery.post("https://got-api.bruck.me/api/city", 
				{name : "King's Landing",
				 coordX: '-84.48536531890602', 
				 coordY:'45.805474068515245', 
				 type:"city", 
				 priority: 2, 
				 link: "http://awoiaf.westeros.org/index.php/King%27s_Landing"}, 
				 function(data){
			chars = data;
			console.log(chars);
		});

	
	
	console.log( {	name: city.name,
								coordX: city.coord.lng,
								coordY: city.coord.lat,
								type: city.type,
								priority: parseInt(city.prio),
								link: city.link
						});
		jQuery.ajax("https://got-api.bruck.me/api/api/city",
						{
							type: 'POST',
							data: {	name: city.name,
								coordX: city.coord.lng,
								coordY: city.coord.lat,
								type: city.type,
								priority: parseInt(city.prio),
								link: city.link
							},
							success: function(data)
										{
											chars = data;
											console.log(chars);
										}
						}
					);*/	
}

