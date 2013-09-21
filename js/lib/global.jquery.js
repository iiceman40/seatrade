//////////////////////////////////////
// VARIABLES						//
//////////////////////////////////////
var clientClickX, clientClickY;
var hoveringOver = null;

var container;

var camera, scene, renderer, objects;

var clock = new THREE.Clock();
var maxAnisotropy = 1;

var ground = [];
var objects = [];

// TODO path finding
var allow_diagonals = true;
var board = [];
var map = []
var fields = new Array();

//Set the number of rows and columns for the board
var rows = 30;
var columns = 30;

// interface
var selectedBlockType = 'blockType1';
var selectedBlock = null;
var selectedMaterial = null;

var projector = new THREE.Projector();

var activeArea = 'town';


//////////////////////////////////////
// RENDER AND ANIMATION				//
//////////////////////////////////////
function animate() {
	// controls
	if( activeArea == "castle" ){
		controls.update();
	}
	requestAnimationFrame( animate );
	render();
}

function render() {
	var delta = clock.getDelta();

	THREE.AnimationHandler.update( delta );
	//camera.lookAt(scene.position);
	
	if( activeArea == "town" ){
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
			
			//console.log( intersects[0] );
			hoveringOver = intersects[0].object;
			intersects[0].object.outline.material = new THREE.MeshBasicMaterial( { color: 0x550000, side: THREE.BackSide } );
			
		} 		
	}
}

// END
console.log('global loaded');