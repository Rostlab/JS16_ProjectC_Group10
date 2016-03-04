/*.--.     Alex Max Tobi          ,-. .--. 
 : .--'   Project C - Map       .'  :: ,. :
 : : _ .--.  .--. .-..-..---.    `: :: :: :
 : :; :: ..'' .; :: :; :: .; `    : :: :; :
 `.__.':_;  `.__.'`.__.': ._.'    :_;`.__.'
                        : :                
                        :_;
*/
jQuery(function () {
	var f = $('#filter input'); // Filter Element
	var l = $('#filter-dropdown'); // Dropdown
	f.keyup(function() {
		var s = f.val().toLowerCase();
		$('#sidebar li').each(function(i, el) {
			el = $(el);
			if(el.text().toLowerCase().indexOf(s) == -1) {
				el.hide();
			} else {
				el.show();
			}
		});
	});
	function search() {
		var s = f.val().toLowerCase();
		var o1 = []; // Beginnt mit
		var o2 = []; // Ist enthalten
		personList.map(function(p) {
			var pos = p.name.toLowerCase().indexOf(s);
			if(pos != -1) {
				(pos === 0 ? o1 : o2).push(p);
			}
		});
		return o1.concat(o2);
	}
	cityInfo = [{"name":"Ashemark","coord":[55.032255185863676,-127.3637423325017]},{"name":"Astapor","coord":[-3.767394214940939,67.650429933597]},{"name":"Bear Island","coord":[82.04773044853751,-124.30676341589796]},{"name":"Braavos, Free City","coord":[67.61337013087294,-43.63063016851733]},{"name":"Brightwater Keep","coord":[21.399898511439893,-134.2155916283376]},{"name":"Casterly Rock","coord":[50.57644901409402,-134.1453162509444]},{"name":"Castle Black","coord":[83.55272561848793,-91.98008981503118]},{"name":"Castle Cerwyn","coord":[77.17920073229219,-105.64865071800637]},{"name":"Clegane's Keep","coord":[47.82222698771253,-134.0399031848546]},{"name":"Cornfield","coord":[43.35024640385221,-131.26402577782366]},{"name":"Crakehall","coord":[40.44799058519699,-138.92404191368124]},{"name":"Craster's Keep","coord":[83.91690889363092,-96.1966124586225]},{"name":"Crownlands","coord":[49.947503999586324,-92.22605363590732]},{"name":"Deep Lake","coord":[83.6233577786785,-95.91551094904973]},{"name":"Dorne","coord":[8.114303563940584,-100.5536858570002]},{"name":"Dothraki Sea","coord":[37.36697939415579,79.96591874071672]},{"name":"Dragonstone","coord":[51.56990703176699,-70.40554895532223]},{"name":"Eyrie","coord":[62.17786192576567,-81.47392089474945]},{"name":"Fist of the First Men","coord":[84.27463234014662,-100.27258434742745]},{"name":"Frostfang Mountains","coord":[84.13199837176445,-112.85225347837473]},{"name":"Hardhome","coord":[84.06404937206392,-79.15483344077423]},{"name":"Harrenhal","coord":[55.41305235255993,-97.32101849691351]},{"name":"Highgarden","coord":[25.872729190757656,-123.07694431151718]},{"name":"Hornwood","coord":[77.77340145634332,-88.99338627582064]},{"name":"Inn at the Crossroads","coord":[58.62410351037153,-94.08835113682683]},{"name":"Karhold","coord":[80.93685915964741,-72.37325952233152]},{"name":"King's Landing","coord":[45.82703866350029,-84.39034905656678]},{"name":"Last Hearth","coord":[81.5620293865879,-87.83384254883302]},{"name":"Lys, Free City","coord":[-0.2914794449511428,-41.662919601508044]},{"name":"Maidenpool","coord":[54.05392804860504,-84.35521136787018]},{"name":"Meereen","coord":[17.558120208286713,75.73209833381368]},{"name":"Moat Cailin","coord":[73.59839996147574,-103.89176628317665]},{"name":"Mole's Town","coord":[83.40104466774291,-91.10164759761632]},{"name":"Myr, Free City","coord":[35.43588422178521,-43.525217102427554]},{"name":"Nightsong","coord":[19.523525155443746,-110.32196331465342]},{"name":"Oldtown","coord":[14.315051407954353,-135.09403384575245]},{"name":"Pentos, Free City","coord":[44.98832642533407,-42.18998493195697]},{"name":"Pyke","coord":[61.47762473635366,-133.99964082248317]},{"name":"Qarth","coord":[-20.3034175184893,148.71093750000003]},{"name":"Raventree Hall","coord":[59.36616165413359,-111.83288392860698]},{"name":"Red Waste","coord":[-5.7908968128719565,123.75000000000001]},{"name":"Riverrun","coord":[57.82854491316596,-112.14912312687632]},{"name":"Runestone","coord":[62.0299034505482,-65.76737404737179]},{"name":"Seagard","coord":[64.5397352158069,-111.30581859815806]},{"name":"Stone Hedge","coord":[57.97790818862611,-106.49195524672464]},{"name":"Stonehelm","coord":[24.025033695510427,-84.88227669831912]},{"name":"Storm's End","coord":[31.389879839113846,-77.39794900594451]},{"name":"Summerhall","coord":[29.4814017663838,-91.10164759761632]},{"name":"Sunspear","coord":[2.132527282139754,-68.19187456743678]},{"name":"The Arbor","coord":[-1.3103594309019575,-143.14056455727254]},{"name":"The Bloody Gate","coord":[61.84808318940004,-85.69044353834077]},{"name":"The Crag","coord":[56.900074424764995,-131.72081573087937]},{"name":"The Dreadfort","coord":[79.5519122445717,-86.00668273661013]},{"name":"The Gift","coord":[82.66435208137177,-87.23650184099093]},{"name":"The Golden Tooth","coord":[54.09516087016627,-121.6714367636534]},{"name":"The Nightfort","coord":[83.45333120326761,-96.96964160994756]},{"name":"The Ruby Ford","coord":[59.98705204110694,-98.51569991259771]},{"name":"The Trident","coord":[58.42228428519202,-97.70753307257604]},{"name":"The Twins","coord":[65.92316589989537,-109.09214421027261]},{"name":"The Vale of Arryn","coord":[65.5331884201938,-72.4786725884213]},{"name":"The Whispering Wood","coord":[61.177741119429406,-111.0598547772819]},{"name":"The Whispers","coord":[56.91925821864521,-66.54040319869686]},{"name":"Torrhen's Square","coord":[77.39570258814301,-118.08739251660077]},{"name":"Tyrosh, Free City","coord":[22.020155164126766,-51.782573946127215]},{"name":"Vaes Dothrak","coord":[56.45612045743628,114.94575891921299]},{"name":"Valyria","coord":[-30.7455220584482,26.047406516829255]},{"name":"Village of the Lhazareen","coord":[24.249492310110526,86.48423107497156]},{"name":"Volantis, Free City","coord":[0.2707213095865004,-1.9221936856598323]},{"name":"Winterfell","coord":[78.59336090101503,-105.36754920843362]},{"name":"Yunkai","coord":[12.05727108327552,71.12906111455982]}]; // name, coord, type
	curCity = -1;
	$('#sidebar').append('<ul></ul>');
	ul = $('#sidebar ul');
	cityInfo.map(function(city, i) {
		var x = "";
		if(city.coord) {
			cityMarkers[i] = new L.marker(city.coord, {
            	draggable: 'true'
        	}).bindPopup("<h4>"+city.name+"</h4>"+city.coord).addTo(markers);
        	x = ' class="onmap"';
		}
		var li = $('<li'+x+'>'+city.name+'</li>').click(function () {
			curCity = i;
		});
		ul.append(li);
	});
});