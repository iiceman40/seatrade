function initFarm() {
	// vars
	var materials = new Array();
	
	// set global vars and clear scene 
	activeArea = 'farm';
	clearScene();
	
	// Camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 350, 350 );
	camera.lookAt(scene.position);

	controls = new THREE.OrbitControls( camera );
	
	// TEXTURES AND MATERIAL
	var materials = loadFarmMaterials();
	
	// MAIN GROUND PALNE
	var mainground = new THREE.Mesh( new THREE.PlaneGeometry( 50000, 50000 ), materials.materialGround );
	mainground.rotation.x = - Math.PI / 2;
	mainground.position.x = 0;
	mainground.position.z = 0;
	mainground.position.y = 0;
	mainground.receiveShadow = true;
	scene.add( mainground );
	
	for(i=0;i<15;i++){
		for(j=0;j<10;j++){
			yPosition = 1
			field = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50 ), materials.materialFloor );
			field.rotation.x = - Math.PI / 2;
			field.position.x = (i+1)*50 - 15*50/2 -25;
			field.position.z = (j+1)*50 - 10*50/2 -25;
			field.position.y = yPosition;
			//field.castShadow = true;
			field.receiveShadow = true;
			scene.add( field );
			ground.push( field );
		}
	}
	
	$.each(cities[player.pos.cityid].farm.fields, function(key, value) {
		scene.add(cities[player.pos.cityid].farm.fields[key]);
		console.log(value);
	});
	console.log(scene);
	
	// environment: lights and effects
	initDayTime();
	//initSunset();
	initLenseFlares(1500, 1000, -1999);
	console.log('environment created');
	
	// UI
	initFarmUI(materials);
	
	$('#container').fadeIn(1000);
}

function onFarmDocumentMouseUp( event ) {
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
	
			var intersectsGround = raycaster.intersectObjects( ground );
			var intersects = raycaster.intersectObjects( objects );
			
        	if( event.button == 2 ) {
        		deleteFarmBlock(intersects[0].object);
        	} else {
				fieldHeight = 5;
				selectedMaterial.vertexColors = THREE.FaceColor;
				geometry = new THREE.CubeGeometry(48,fieldHeight,48);
				geometry.dynamic = true;
				geometry.computeFaceNormals();
				geometry.computeVertexNormals();
				var block = new THREE.Mesh(	geometry, selectedMaterial	);
				setFarmBlockPosition(block, intersects, intersectsGround);
			}
		}
		//console.log(objects);
	}
}

function deleteFarmBlock(block){
	// DELETING
	block.tween.stop();
	scene.remove(block.outline);
	scene.remove(block);
	for(i=0; i<objects.length; i++){
		if( objects[i].id == block.id )
			objects.splice(i,1);
	}
}

function rotateX(){
	selectedBlock.object.outline.rotation.x += Math.PI/2;
	selectedBlock.object.rotation.x += Math.PI/2;
}

function rotateY(){
	selectedBlock.object.outline.rotation.y += Math.PI/2;
	selectedBlock.object.rotation.y += Math.PI/2;
}

function rotateZ(){
	selectedBlock.object.outline.rotation.z += Math.PI/2;
	selectedBlock.object.rotation.z += Math.PI/2;
}

function setFarmBlockPosition(block, intersects, intersectsGround){
	if ( intersectsGround.length > 0 ) {
		// BLOCK ON GROUND
		field = intersectsGround[ 0 ].object;
		yPosition = fieldHeight/2;
		outline = 2;
		
		block.position.x = field.position.x;
		block.position.z = field.position.z;
		block.position.y = field.position.y + outline;
		
		block.castShadow = true;
		block.receiveShadow = true;
		block.geometry.dynamic = true;
		
		geometry.verticesNeedUpdate = true;
		geometry.elementsNeedUpdate = true;
		geometry.morphTargetsNeedUpdate = true;
		geometry.uvsNeedUpdate = true;
		geometry.normalsNeedUpdate = true;
		geometry.colorsNeedUpdate = true;
		geometry.tangentsNeedUpdate = true;
		
		// OUTLINE
		var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
		block.outline = new THREE.Mesh( block.geometry, outlineMaterial1 );
		block.outline.position = block.position;
		block.outline.scale.multiplyScalar(block.scale.x * 1.05);
		
		objects.push(block);
		
		cities[player.pos.cityid].farm.fields.push(block);
		
		block.city = player.pos.cityid;
		block.farm = true;
		
		scene.add( block );
		scene.add( block.outline );
		
		grow( block );
		
		console.log(block)
	}
}

function grow(block) {
	var initialScale = 1;
	var finialScale = 15;
	block.tween = new TWEEN.Tween({x: initialScale}).to({x: finialScale}, 30000);
	
	block.tween.onUpdate(function(){
	    block.scale.y = this.x;
	    block.outline.scale.y = this.x;
	}).repeat();
	
	block.tween.onComplete(function(){
    	if(cities[player.pos.cityid].farm.wheat == undefined)
    		cities[player.pos.cityid].farm.wheat = 0;
    	// TODO seperate between the different farm types
    	cities[player.pos.cityid].farm.wheat++;
    	$('.wheatBarn').html(cities[player.pos.cityid].farm.wheat);
    	grow(block); // grow time as parameter?
	});
	block.tween.start();
}