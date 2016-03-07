/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
gotDB = {
	characterInfo: [
	{name:'Eddard Stark', img:'img/persons/edd.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Eddard_Stark'},
	{name:'Robb Stark', img:'img/persons/robb.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Robb_Stark'},
	{name:'Sansa Stark', img:'img/persons/sansa.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Sansa_Stark'},
	{name:'Catelyn Stark', img:'img/persons/catelyn.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Catelyn_Stark'},
	{name:'Arya Stark', img:'img/persons/arya.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Arya_Stark'},
	{name:'Brandon Stark', img:'img/persons/bran.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Brandon_Stark'},
	{name:'Rickon Stark', img:'img/persons/rickon.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Rickon_Stark'},
	{name:'Jon Snow', img:'img/persons/jon.jpg', house:'House Stark', link:'http://awoiaf.westeros.org/index.php/Jon_Snow'},
	{name:'Daenerys Targaryen', img: 'img/persons/daenerys.jpg', house:'House Targaryen', link:'http://awoiaf.westeros.org/index.php/Daenerys_Targaryen'},
	{name:'Tywin Lannister', img:'img/persons/tywin.png', house:'House Lannister', link:'http://awoiaf.westeros.org/index.php/Tywin_Lannister'},
	{name:'Jaime Lannister', img:'img/persons/jaime.png', house:'House Lannister', link:'http://awoiaf.westeros.org/index.php/Jaime_Lannister'},
	{name:'Cersei Lannister', img:'img/persons/cersei.jpeg', house:'House Lannister', link:'http://awoiaf.westeros.org/index.php/Cersei_Lannister'},
	{name:'Tyrion Lannister', img:'img/persons/tyrion.png', house:'House Lannister', link:'http://awoiaf.westeros.org/index.php/Tyrion_Lannister'}
],
	
	curCharacter: -1,
	setCurrent: function(i) 
	{
		gotDB.curCharacter = i;
	},
	getCurrent: function() 
	{
		return gotDB.characterInfo[gotDB.curCharacter];
	},
	updateCurrent: function(n) 
	{
		for(var key in n) 
		{
			gotDB.curCharacter[gotDB.curCharacter][key] = n[key];
		}
	},
	getAll:function() 
	{
		return gotDB.characterInfo;
	}
};