/*
 _   _           _         _       ___                              ____           _     _           
| \ | | ___   __| | ___   (_)___  |_ _|_ __ ___   __ _  __ _  ___  |  _ \ __ _  __| | __| | ___ _ __ 
|  \| |/ _ \ / _` |/ _ \  | / __|  | || '_ ` _ \ / _` |/ _` |/ _ \ | |_) / _` |/ _` |/ _` |/ _ \ '__|
| |\  | (_) | (_| |  __/_ | \__ \  | || | | | | | (_| | (_| |  __/ |  __/ (_| | (_| | (_| |  __/ |   
|_| \_|\___/ \__,_|\___(_)/ |___/ |___|_| |_| |_|\__,_|\__, |\___| |_|   \__,_|\__,_|\__,_|\___|_|   
                        |__/                           |___/                                         
	formally known as hbo-scalehelper.php                                                    
*/
var lwip = require('lwip');
var fs = require('fs');

fs.readdir('.', function(err, dir) {
    dir.map(function(file) {
        if (file.substr(-4) === ".png") {
            console.log(file);
            lwip.open(file, function(err, image) {
                if (err) throw err;

                if (image.width() !== 256 || image.height() !== 256) {

                    image.pad(0, 0, (256 - image.width()), (256 - image.height()), {
                        r: 0,
                        g: 0,
                        b: 0,
                        a: 0
                    }, function(err, i) {
                        i.writeFile(file, function(err) {
                            if (err) throw err;
                        });
                    });
                }
            });
        }
    });
});