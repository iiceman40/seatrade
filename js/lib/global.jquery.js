//////////////////////////////////////
// VARIABLES						//
//////////////////////////////////////
var clientClickX, clientClickY;
var hoveringOver = null;

var container;

var camera, renderer, objects;

// TODO different scenes for the different game areas. might fix the problem with reinitiating the farm after leaving
var scene = new THREE.Scene();

var projector = new THREE.Projector();
var maxAnisotropy = 1;
var clock = new THREE.Clock();
var time = new Date().getTime();

var ground = [];
var objects = [];

// CASTLE BUILD
var selectedBlockType = 'blockType1';
var selectedBlock = null;
var selectedMaterial = null;
var rows = 30;
var columns = 30;

// MAP
var citynames = ["Aschering","Schmidham","Liebenhof","Geringswalde","Schrammlhof","Hohburkersdorf","Leerhafe","Burgkhammer","Metzenried","Auretzdorf"];
var cities = new Array();

// PLAYER
var player = new Object();
player.pos = new Object();
player.pos.x = 0;
player.pos.y = 0;

player.traveling = false;

// GENERAL GAMEPLAY
var activeArea = 'town';
travelSpeed = 200;

//////////////////////////////////////
// INIT RENDERER					//
//////////////////////////////////////
renderer = new THREE.WebGLRenderer({antialias:true, transparent: true, preserveDrawingBuffer: true});

// enable shadows on the renderer
renderer.shadowMapEnabled = true;
renderer.shadowMapType = THREE.PCFSoftShadowMap;
renderer.physicallyBasedShading = true;
renderer.setSize( window.innerWidth, window.innerHeight );
maxAnisotropy = renderer.getMaxAnisotropy();


//////////////////////////////////////
// RENDER AND ANIMATION				//
//////////////////////////////////////
function animate() {
	// controls
	if( activeArea == "castle" || activeArea == "farm" ){
		controls.update();
	}
	requestAnimationFrame( animate );
	render();
}

function render() {
	var delta = clock.getDelta();
	timeNew = new Date().getTime();
	
	/*
	if(cities[player.pos.cityid] != undefined && delta > 1000){
		$.each(cities[player.pos.cityid].farm.fields, function(key, value) {
			if( value.scale.y < 15)
				value.scale.y++;
			else if( value.scale.y >= 15)
				value.scale.y = 1;
		});
	}
	*/

	THREE.AnimationHandler.update( delta );
	//camera.lookAt(scene.position);
	
	if( activeArea != "castle"){
		TWEEN.update();
	}
	//controls.update( delta );
	renderer.render( scene, camera );

}

//////////////////////////////////////
// OTHER HELPER FUNCTIONS			//
//////////////////////////////////////
function lensFlareUpdateCallback( object ) {
	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;

	for( f = 0; f < fl; f++ ) {
		   flare = object.lensFlares[ f ];
		   flare.x = object.positionScreen.x + vecX * flare.distance;
		   flare.y = object.positionScreen.y + vecY * flare.distance;
		   flare.rotation = 0;
	}
	
	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
}

function clearScene(){
	// clear object arrays
	ground = [];
	objects = [];
	
	//remove everything
    for (var i=scene.children.length-1; i>=0; i--) {
        //if(scene.children[i] instanceof THREE.Camera) continue; //leave camera in the scene
        scene.remove(scene.children[i]);
    }
	scene = new THREE.Scene();
	console.log('scene cleared');
}

function changeTownNameTo(newName) {
	$('.town-name').fadeOut(500, function(){
		$('.town-name').html( newName );
		$('.town-name').fadeIn(500);
	});
}

function cameraTo(target, time) {
	var position = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
	//var target = { x : 70, y: 30, z: 300 };
	tween = new TWEEN.Tween(position).to(target, time);
		
	tween.onUpdate(function(){
	    camera.position.x = position.x;
	    camera.position.y = position.y;
	    camera.position.z = position.z;
	});
	tween.start();
}

//////////////////////////////////////
// EVENTS							//
//////////////////////////////////////
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseDown( event ) {
	clientClickX = event.clientX;
	clientClickY = event.clientY;
}

function onDocumentMouseUp( event ) {
	// TODO better case than if
	if( activeArea == 'town'){
		onTownDocumentMouseUp(event);
	}
	if( activeArea == 'castle'){
		onCastleDocumentMouseUp(event);
	}
	if( activeArea == 'farm'){
		onFarmDocumentMouseUp(event);
	}
}
function onDocumentMouseMove( event ) {
	event.preventDefault();
	if (event.target == renderer.domElement) {
		var x = event.clientX;
    	var y = event.clientY;
    	
		var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
		projector.unprojectVector( vector, camera );
		var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

		var intersectsGround = raycaster.intersectObjects( ground );
		var intersects = raycaster.intersectObjects( objects );
		
		if( hoveringOver != null) {
			hoveringOver.outline.material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			hoveringOver = null;
		}
		
		if ( intersects.length > 0 ) {
			field = intersects[ 0 ].object;
			hoveringOver = intersects[0].object;
			intersects[0].object.outline.material = new THREE.MeshBasicMaterial( { color: 0x550000, side: THREE.BackSide } );
		} 		
	}
}

// END
console.log('global loaded');