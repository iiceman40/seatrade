function initTown(from) {
	activeArea = 'town';
	clearScene();
	
	// Camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 150, 150, 400 );
	camera.lookAt(scene.position);
	
	// Materials
	loadTownMaterials();
	
	//////////////////////////////////////
	// MAIN GROUND PLANE				//
	//////////////////////////////////////
	var mainground = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 1000 ), materialStoneWall );
	mainground.rotation.x = - Math.PI / 2;
	mainground.position.x = 0;
	mainground.position.z = 400;
	mainground.position.y = 0;
	mainground.receiveShadow = true;
	scene.add( mainground );
	
	var ocean = new THREE.Mesh( new THREE.PlaneGeometry( 10000, 1000 ), materialWater );
	ocean.rotation.x = - Math.PI / 2;
	ocean.position.x = 0;
	ocean.position.z = -600;
	ocean.position.y = 0;
	ocean.receiveShadow = true;
	scene.add( ocean );
	
	// Models
	loadTownModels();
	
	// Object and Camera Movement
	var position = { x : 150, y: 150, z: 400 };
	var target = { x : 70, y: 30, z: 300 };
	tween = new TWEEN.Tween(position).to(target, 2000);
	
	tween.onUpdate(function(){
	    camera.position.x = position.x;
	    camera.position.y = position.y;
	    camera.position.z = position.z;
	    camera.lookAt(scene.position);
	});
	tween.delay(2000)
	tween.start();
	setTimeout(function(){
		$('.town-name').fadeIn(800);
	},3000);
	
	// Effects and Enviorment
	initSunset();
	initLenseFlares(0, 250, -400);
	
	if(from!=null){
		$('#container').fadeIn(1000);
	}
}

// Events
function onTownDocumentMouseUp( event ){
	if (event.target == renderer.domElement) {
		var x = event.clientX;
    	var y = event.clientY;
    	// If the mouse moved since the mousedown then don't consider this a selection
    	if( x != clientClickX || y != clientClickY )
            return;
        else {
			var vector = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1, - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 );
			projector.unprojectVector( vector, camera );
			var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	
			var intersects = raycaster.intersectObjects( objects );
			console.log(intersects);
			
			if ( intersects.length > 0 ) {
				// TWEENING
				target = {x: intersects[0].object.position.x, y: intersects[0].object.position.y+30, z: intersects[0].object.position.z};
				
				// special animation for dock area
				if(intersects[0].object.switchTo == 'dock') {
					target.z = target.z+150;
					target.x = target.x+50; 
				}
				//cameraTo(target,1000);
				
				switch( intersects[0].object.switchTo ){
					case 'farm': loadFarm(); break;
					case 'castle': loadCastle(); break;
					case 'dock': loadDock(); break;
					default: break;
				}
			}
		}
	}
}

// ACTIONS FOR SWITCHING SCENES
function loadFarm(){
	$('#container').fadeOut(1000, function(){ 
		initFarm();
		console.log('farm loaded');
		$('.hud').hide();
		$('.farm-hud').show();
	});
}
function loadCastle(){
	$('#container').fadeOut(1000, function(){
		initCastle();
		console.log('castle loaded');
		$('.hud').hide();
		$('.castle-hud').show();
	});
}
function loadDock(){
	setTimeout(function(){
		initDock();
		console.log('dock loaded');
		$('.hud').hide();
		$('.dock-hud').show();
	}, 1000);
}

console.log('town loaded');
