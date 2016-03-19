# GoT Map (JS16_ProjectC)
The known GoT world is vast and stretches over the three continents of Westeros, Essos and Sothorys. Readers of the Ice and Fire books will get acquainted and transported from King's Landing to the borders of the Seven Kingdoms, and further on across the Narrow Sea. Over two thousand characters mentioned in the books have been associated with multiple landmarks in the GoT world. Your mission is to find character-place associations and put those associations on an interactive GoT map. Such a tool will help us figure out where did Gregor “the hound” Clegane went on his travels and how are these travels coincide with the travels of Breanne of Tarth (hint: they never crossed paths in the books, however they had a deadly duel during the show).
# Links
  - Main wiki entry: https://rostlab.org/owiki/index.php/Javascript_technology_2016#Project_C 
  - Live demo: http://map.got.show
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

#
Konstruktor([htmlEl] mapEl, [object] options)
# Map API

## Modal
Show the modal:
```javascript
showModal([callback] function, [object] information, [string] cssclass)
```
Hide the modal:
```javascript
hideModal()
```
## Characters in the map
Add a character:
```javascript
addCharacter([object] character)
```
Remove a character:
```javascript
removeCharacter([object] character)
```
Show a character:
```javascript
showCharacter([object] character)
```
Hide a character:
```javascript
hideCharacter([object] character)
```
Toggle a character:
```javascript
toggleCharacter([object] character)
```
Remove all characters:
```javascript
removeAllCharacters()
```
Zoom in on character:
```javascript
focusOnCharacters()
```

## Paths
Updates the map (by updating **paths**, characters, realms):
```javascript
updateMap([array] range)
```
## Realms
Show realms:
```javascript
showRealms([bool] color, [double] opacity)
```
Hide realms:
```javascript
hideRealms()
```
Toggle realms:
```javascript
toggleRealms()
```
## Credits:
```javascript
getCredits()
```