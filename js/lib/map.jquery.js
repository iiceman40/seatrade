// vars
var stage = null;
var background = new Kinetic.Layer();
var landLayer = new Kinetic.Layer();
var waterLayer = new Kinetic.Layer();
var cityLayer = new Kinetic.Layer();
var messageLayer = new Kinetic.Layer();
var lineLayer = new Kinetic.Layer();

var options = new Object();
options.cities = 10;

var gridsize = 6;
var mapwidth = 0;
var mapheight = 0;
var map = new Array();

var grid;
var finder;
var path;

var amountLand = 0;
var amountWater = 0;

var coastline = new Array();

// PRELOAD
var imageArray;
var sources = {
	desert: 'http://seatrade.circleart.de/gfx/landscape_v1.jpg',
	ocean: 'http://seatrade.circleart.de/gfx/ocean_v1.jpg'
};
$(document).ready(function(){
	initMap();
	initMapUI();
});
function initMap() {
	if( $('.destination').length == 0){
		$('body').append('<div class="destination"></div>')
	}
	
	// init stage
	stage = new Kinetic.Stage({
		container: 'mapcontainer',
		width: 1015,
		height: 675
	});
	mapwidth = Math.floor(stage.attrs.width / gridsize);
	mapheight = Math.floor(stage.attrs.height / gridsize);
	
    loadImages(sources, function(images) {
    	imageArray = images;
    	
		// GENERATE MAP
		//while(amountLand <= amountWater/3 || amountLand > amountWater)
		generateMap();
		
		// PLACE CITIES
		while (cities.length < options.cities)
			placeCity();
		
		console.log( cities );
		console.log('playerpos '+player.pos.cityid);
		
		generateGrid();
		//console.log(coastline.length);
		
		// DRAW
		drawMap();
    });
}	
	
/*
 * MAP HELPER FUNCTIONS 
 */
function loadImages(sources, callback) {
	var images = {};
    var loadedImages = 0;
    var numImages = 0;
    // get num of sources
    for(var src in sources) {
      numImages++;
    }
    for(var src in sources) {
      images[src] = new Image();
      images[src].onload = function() {
        if(++loadedImages >= numImages) {
          callback(images);
        }
      };
      images[src].src = sources[src];
    }
}
  
function generateMap(){
	console.log('generating map');
	amountLand = 0;
	amountWater = 0;
	var random = Math.random() * mapwidth / 5 + 3;
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
	
	coastline = new Array();
	coords = new Object();
	coords.x = mapwidth*gridsize+gridsize;
	coords.y = random*gridsize;
	coastline.push(coords);
	var stopx = Math.ceil( Math.random()*10 ) * gridsize;
	var stopy = 0;
	
	for( i=mapwidth-1; i>=0; i--){
		map[i] = new Array();
		// random value for this line
		if(plusOrMinus == 1)
			plusOrMinus = Math.random() < 0.1 ? -1 : 1;
		else
			plusOrMinus = Math.random() < 0.9 ? -1 : 1;
		//random = random + Math.random() * mapwidth / 20 * plusOrMinus;
		random = random + Math.random() * 2 * plusOrMinus;
		if(random<0) random = 0;
		for( j=0; j<mapheight; j++){
			if(i>=stopx){
				coords = new Object();
				coords.x = i*gridsize + gridsize/2;
				coords.y = Math.ceil(random*gridsize);
				coastline.push(coords);
			}
			
			// set terrain type
			if( j <= random ||  (i<=stopx && j<=stopy)  ){
				color = '#e5b070';
				type = 'land';
				amountLand++;
			} else {
				color = 'blue';
				type = 'water';
				amountWater++;
			}
			
			// draw squares
			var rect = new Kinetic.Rect({
		        x: i*gridsize,
		        y: j*gridsize,
		        width: gridsize,
		        height: gridsize,
		        //fill: color,
		        stroke: 'black',
		        strokeWidth: 1,
		    });
		    // save position for each square
		    rect.xpos = i;
		    rect.ypos = j;
		    // save type and color, too
		    rect.type = type;
		    rect.color = color;
		    // on click event
		    rect.on('mousedown', function() {
		        squareClicked(this);
		    });
		    // on hover event
		    rect.on('mouseover', function() {
		        squareHover(this);
		    });
		    // on mouse out event
		    rect.on('mouseout', function() {
		    	if(!player.traveling){
			    	lineLayer.removeChildren();
			    	lineLayer.draw();
			    }
		        $('.destination').fadeOut(200);
		    });
		    //add square to map array
		    map[i][j] = rect;
		    
		    if (i == stopx) {
		    	stopy = Math.floor(random);
		    }
		}
	}
	//console.log(stopx + " " + stopy);
	
	var random = stopx;
	var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
	for(i=stopy; i<mapheight; i++){
		if(plusOrMinus == 1)
			plusOrMinus = Math.random() < 0.1 ? -1 : 1;
		else
			plusOrMinus = Math.random() < 0.9 ? -1 : 1;
		//random = random + Math.random() * mapheight / 10 * plusOrMinus;
		random = random + Math.random() * 2 * plusOrMinus;
		if(random<0) random = 0;
		for(j=0; j<mapwidth; j++){
			if( map[j][i].type == 'water' && j <= random || ( j <= stopx && j <= random) ){
				coords = new Object();
				coords.y = i*gridsize + gridsize/2;
				coords.x = Math.floor(random*gridsize) + gridsize/2;
				coastline.push(coords);
				color = '#e5b070';
				type = 'land';
				amountLand++;
				amountWater--;
				
				map[j][i].type = 'land';
				//map[j][i].attrs.fill = color;
			}
		}
	}
	coords = new Object();
	coords.x = 0;
	coords.y = mapheight*gridsize;
	coastline.push(coords);
	coords = new Object();
	coords.x = 0;
	coords.y = 0;
	coastline.push(coords);
	coords = new Object();
	coords.x = mapwidth*gridsize;
	coords.y = 0;
	coastline.push(coords);
}

function smoothBlob() {
	var smoothCoastline = new Array();
	for (i=0; i<coastline.length; i++){
		smoothCoastline.push(coastline[i]);
		if( i < coastline.length-1 ){
			sCoord = new Object();
			sCoord.x = Math.ceil( (coastline[i].x + coastline[i+1].x)/2 );
			sCoord.y = Math.ceil( (coastline[i].y + coastline[i+1].y)/2 );
			smoothCoastline.push(sCoord);
		}
	}
	return smoothCoastline;
}

// PLACE CITIES
function placeCity(){
	posx = Math.floor(Math.random()*mapwidth);
	posy = Math.floor(Math.random()*mapheight);
	//console.log(posx + " " + posy);
	
	if( map[posx][posy].type == 'land' ) {
		if ( hasWaterConnection(posx,posy) && noCitiesNear(posx,posy,4) && notOnEdge(posx,posy) ){
			map[posx][posy].type = 'city';
			map[posx][posy].cityid = cities.length;
			map[posx][posy].attrs.fill = 'red';
			map[posx][posy].attrs.width = 2*gridsize;
			map[posx][posy].attrs.height = 2*gridsize;
			map[posx][posy].attrs.x = map[posx][posy].attrs.x-gridsize/2;
			map[posx][posy].attrs.y = map[posx][posy].attrs.y-gridsize/2;
			city = new Object();
			
			// TODO dynamically add plants from a list
			city.farm = new Object();
			city.farm.field = new Object();
			city.farm.storage = new Object();
			// wheat
			city.farm.field.wheat = new Object();
			city.farm.field.wheat.numberOfParcels = 0;
			city.farm.field.wheat.parcelIds = new Array();
			city.farm.storage.wheat = 0;
			// cattle
			city.farm.field.cattle = new Object();
			city.farm.field.cattle.numberOfParcels = 0;
			city.farm.field.cattle.parcelIds = new Array();
			city.farm.storage.cattle = 0;
			
			city.name = citynames[cities.length];
			city.id = cities.length;
			city.x = posx;
			city.y = posy;
			
			// temp player start location
			player.pos.x = posx;
			player.pos.y = posy;
			player.pos.cityname = city.name;
			player.pos.cityid = city.id;
			$('.town-name').text(player.pos.cityname);
			
			cities.push(city);
			console.log('city placed');
		}
	}
}

function notOnEdge(x, y){
	if( x==0 || y==0 || x==mapwidth-1 || y==mapheight-1 )
		return false;
	else
		return true;
}

function hasWaterConnection(x, y){
	if( x+1<mapwidth ){ 
		if( map[x+1][y].type == 'water' )
			return true;
	} else if( x-1>=0 ) {
		if( map[x-1][y].type == 'water' )
			return true;
	} else if( y+1<mapheight ){
		if( map[x][y+1].type == 'water' )
			return true;
	} else if( y-1>=0) {
		if( map[x][y-1].type == 'water' ) 
			return true;
	} else return false;
}

function noCitiesNear(x, y, distance){
	for(i=0; i<cities.length; i++){
		if( Math.abs(cities[i].x - x) <= distance && Math.abs(cities[i].y - y) <= distance )
			return false;
	}
	return true;
}

function squareClicked(square){
	//alert(square.type + " at "+ square.xpos + "," + square.ypos)
	if(square.type=='city' &&  player.traveling == false){
		if(square.xpos != player.pos.x || square.ypos != player.pos.y){
			lineLayer.removeChildren();
			lineLayer.draw();
			
			changeTownNameTo('On the ocean...');
			
			var line = new Array();
		    for(i=0; i<path.length; i++){
		    	line[i] = new Object(); 
		    	line[i].x = path[i][0]*gridsize+gridsize/2;
		    	line[i].y = path[i][1]*gridsize+gridsize/2;
		    }
		    
		    player.traveling = true;
		    followPath(0, square);
		}
	}
}

function squareHover(square){
	if( square.type == 'city' )
		writeMessage(messageLayer, citynames[square.cityid]);
		
	if(square.type=='city' && !player.traveling){
		// start = [player.pos.x, player.pos.y];
		// destination = [square.xpos, square.ypos];
		
	    //console.log(grid);
	    //console.log(player.pos.x, player.pos.y, square.xpos, square.ypos);
	    //console.log(grid);
	    //console.log(grid.nodes[player.pos.x][player.pos.y]);
	    path = finder.findPath(player.pos.x, player.pos.y, square.xpos, square.ypos, grid.clone() );
	    //console.log(path);
	    
	    line = new Array();
	    for(i=0; i<path.length; i++){
	    	line[i] = new Object(); 
	    	line[i].x = path[i][0]*gridsize+gridsize/2;
	    	line[i].y = path[i][1]*gridsize+gridsize/2;
	    }
	    //console.log(line);
		pathLine = new Kinetic.Spline({
	        points: line,
	        stroke: '#444',
	        strokeWidth: 2,
	        lineCap: 'round',
	        tension: 0.9,
	        dashArray: [5, 10],
	        shadowColor: 'black',
		    shadowBlur: 5,
		    shadowOffset: 1,
		    shadowOpacity: 0.5
	    });
	    lineLayer.add(pathLine);
	    lineLayer.draw();
	    //console.log(lineLayer);
	} 
}

function generateGrid(){
	grid = new PF.Grid(mapwidth, mapheight); 
    for (var x = 0; x < mapwidth; x++){
        for (var y = 0; y < mapheight; y++){
            if (map[x][y].type == 'land')
            	grid.setWalkableAt(x, y, false);
            else
                grid.setWalkableAt(x, y, true);
        }
    }
    //console.log(grid);
	finder = new PF.BreadthFirstFinder({
	    allowDiagonal: true,
	    dontCrossCorners: true
	});
}

function writeMessage(messageLayer, message) {
	$('.destination').html(message);
	$('.destination').fadeIn(200);
	offset = $('#mapcontainer').position();
	var mousePos = stage.getMousePosition();
    var x = mousePos.x + 80 + offset.left;
    var y = mousePos.y - 30 + offset.top;
	$('.destination').css({
		'top': y + 'px',
		'left': x + 'px'
	});
    /*
    var context = messageLayer.getContext();
    messageLayer.clear();
    messageLayer.removeChildren();
    var text = new Kinetic.Text({
        text: message,
        fontFamily: 'Calibri',
        fontSize: 20,
        x: x,
        y: y,
        fill: 'black',
        shadowColor: 'white',
        shadowBlur: 0,
        shadowOffset: [0, 0],
        shadowOpacity: 0.9
    });
    messageLayer.add(text);
    messageLayer.draw();
    */
}

// DRAW
function drawMap(){
	var rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: stage.attrs.width,
        height: stage.attrs.height,
        //fill: 'blue',
        //opacity: 0.5,
        fillPatternImage: imageArray.ocean,
        stroke: 'none',
        strokeWidth: 0
      });
	background.add(rect)
	var rect = new Kinetic.Rect({
        x: 0,
        y: 0,
        width: stage.attrs.width,
        height: stage.attrs.height,
        fill: 'blue',
        opacity: 0.7,
        //fillPatternImage: imageArray.ocean,
        stroke: 'none',
        strokeWidth: 0
      });
	background.add(rect)
	stage.add(background);
	/*
	for( i=0; i<mapwidth; i++){
		for( j=0; j<mapheight; j++){
		    // add the shape to the layer
		    if( map[i][j].type == 'water')
			    waterLayer.add(map[i][j]);
		}
	}
	*/
	stage.add(waterLayer);
	
	var blob = new Kinetic.Blob({
	  points: coastline, //smoothBlob(),
	  tension: 0.8,
	  //fill: '#e5b070',
	  fillPatternImage: imageArray.desert,
	  stroke: 'black',
	  strokeWidth: 2,
	  shadowColor: 'black',
      shadowBlur: 30,
      shadowOffset: 0,
      shadowOpacity: 0.99
	});
	
	landLayer.add(blob)
	stage.add(landLayer);
	
	/*
	for( i=0; i<mapwidth; i++){
		for( j=0; j<mapheight; j++){
		    // add the shape to the layer
		    if( map[i][j].type == 'land')
		    	landLayer.add(map[i][j]);
		}
	}
	*/
	//stage.add(landLayer);
	
	stage.add(lineLayer);
	
	for( i=0; i<mapwidth; i++){
		for( j=0; j<mapheight; j++){
		    // add the shape to the layer
		    if( map[i][j].type == 'city')
		    	cityLayer.add(map[i][j]);
		}
	}
	stage.add(cityLayer);
	// add the layer to the stage
	stage.add(messageLayer);
	
}

function followPath(i, square){
	//console.log(i);
	pathLine = new Kinetic.Spline({
        points: [line[i],line[i+1]],
        stroke: 'darkred',
        strokeWidth: 4,
        lineCap: 'round',
        tension: 0.9,
        dashArray: [5, 10],
        shadowColor: 'black',
	    shadowBlur: 5,
	    shadowOffset: 3,
	    shadowOpacity: 0.5
    });
    lineLayer.add(pathLine);
    lineLayer.draw();
    if(i+1 < line.length-2){
	    setTimeout(function(){
	    	followPath(i+2, square);
	    }, travelSpeed);
	} else {
		// destination reached
		player.traveling = false;
		setTimeout(function(){
			//arrived
			player.pos.x = square.xpos;
			player.pos.y = square.ypos;
		    player.pos.cityname = citynames[square.cityid];
		    player.pos.cityid = square.cityid
		    
		    // LOAD NEW TOWN SCENE
		    console.log('town reached');
	    	$('.map-area').fadeOut(100);
	    	$('.town-name').fadeOut(500);
		    $('#container').fadeOut(1000, function(){
		    	changeTownNameTo(player.pos.cityname);
		    	$('.town-name').hide();
		    	target = { x : 150, y: 150, z: 400 };
		    	cameraTo(target, 10);
			    initTown();
			    $('#container').fadeIn(1000, function(){
			    	setTimeout(function(){
						$('.town-name').fadeIn(800);
					},1000);
			    });
		    });
		    
			lineLayer.removeChildren();
		    lineLayer.draw();
	    }, travelSpeed*2);
	}
}
