console.log("  ____     _____   __  __");
console.log(" / ___| __|_   _| |  \\/  | __ _ _ __");
console.log("| |  _ / _ \\| |   | |\\/| |/ _` | '_ \\");
console.log("| |_| | (_) | |   | |  | | (_| | |_) |");
console.log(" \\____|\\___/|_|   |_|  |_|\\__,_| .__/");
console.log(" Maximilian Bandle @mbandle    |_|");
console.log(" Alexander Beischl @AlexBeischl");
console.log(" Tobias Piffrader  @tpiffrader");
console.log(" Path Combining Tool v0.1");

if(process.argv.length != 4) {
	console.error("You have to pass exact 2 parameters:");
	console.error("  1. Path DB file");
	console.error("  2. Path file to add");
	process.exit(1);
}

var fs = require('fs');

fs.readFile(process.argv[2], 'utf8', function (err, data) {
	if (err) throw err; // we'll not consider error handling for now
	var characters = JSON.parse(data);
	fs.readFile(process.argv[3], 'utf8', function (err, data) {
		if (err) throw err; // we'll not consider error handling for now
		var addCharacter = JSON.parse(data);
		var added = false;
		for(var i = 0;i<characters.length;i++) {
			var c = characters[i];
			if(c.name != addCharacter.name) {
				continue;
			}
			added = true;
			characters[i] = addCharacter;
		}
		if(!added) {
			characters.push(addCharacter);
		}
		fs.writeFile(process.argv[2], JSON.stringify(characters));
	});
});