# GoT Map (JS16_ProjectC)
_Maximilian Bandle, Alexander Beischl and Tobias Piffrader_

The known GoT world is vast and stretches over the three continents of Westeros, Essos and Sothorys. Readers of the Ice and Fire books will get acquainted and transported from King's Landing to the borders of the Seven Kingdoms, and further on across the Narrow Sea. Over two thousand characters mentioned in the books have been associated with multiple landmarks in the GoT world. Your mission is to find character-place associations and put those associations on an interactive GoT map. Such a tool will help us figure out where did Gregor “the hound” Clegane went on his travels and how are these travels coincide with the travels of Breanne of Tarth (hint: they never crossed paths in the books, however they had a deadly duel during the show).

# Links
  - Main wiki entry: https://rostlab.org/owiki/index.php/Javascript_technology_2016#Project_C 
  - Live demo: http://rostlab.github.io/JS16_ProjectC_Group10/
  - How to use it: https://github.com/Rostlab/JS16_ProjectC_Group10/wiki/API
  - npm package: https://www.npmjs.com/package/gotmap
  
#Usage

Example:
```javascript
var map = require("gotmap");
map.config(object);
// object incluse two fields:
// apiLocation = link to the api
// apiToken = token for post/put/delete request to api
map.init();
// create a map
```

Dependencies
============
  - Leaflet@v0.7.7 (+ Label Plugin)
  - jQuery (+ UI)
  - Bootstrap

# Work in progress

  - Editor for map
  - Character Paths
  - Colored Realms

# HOWTO
##run web page:
Install the gotmap and open the map:

```shell
npm install gotmap
open node_modules/gotmap/mockup/mockup.html
```

## Run Editor
```shell
open editor/editor.html
```

## Run the tests
Install node modules:
```shell
npm update
```
Run tests:
```shell
grunt
```
or
```shell
npm test
```
