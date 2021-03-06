function initCastle() {
	// vars
	var materials = new Array();
	
	// set global vars and clear scene 
	activeArea = 'castle';
	clearScene();
	
	// Camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.set( 0, 350, 350 );
	camera.lookAt(scene.position);

	controls = new THREE.OrbitControls( camera );
	
	// TEXTURES AND MATERIAL
	var materials = loadCastleMaterials();
	
	// MAIN GROUND PALNE
	var mainground = new THREE.Mesh( new THREE.PlaneGeometry( 50000, 50000 ), materials.materialGround );
	mainground.rotation.x = - Math.PI / 2;
	mainground.position.x = 0;
	mainground.position.z = 0;
	mainground.position.y = 0;
	mainground.receiveShadow = true;
	scene.add( mainground );
	
	for(i=0;i<rows;i++){
		for(j=0;j<columns;j++){
			yPosition = 1
			field = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50 ), materials.materialFloor );
			field.rotation.x = - Math.PI / 2;
			field.position.x = (i+1)*50 - rows*50/2 -25;
			field.position.z = (j+1)*50 - columns*50/2 -25;
			field.position.y = yPosition;
			//field.castShadow = true;
			field.receiveShadow = true;
			scene.add( field );
			ground.push( field );
		}
	}
	
	// environment: lights and effects
	initDayTime();
	//initSunset();
	initLenseFlares(1500, 1000, -1999);
	console.log('environment created');
	
	// UI
	initCastleUI(materials);
	
	$('#container').fadeIn(1000);
}

function onCastleDocumentMouseUp( event ) {
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
        		if( intersects[0].object.selected == true ){
        			intersects[0].object.material = intersects[0].object.materialBackup;
					intersects[0].object.selected = false;
					selectedBlock = null;
        		} else {
	        		// DESELECT ALL
	        		for(i=0; i<objects.length; i++){
	        			if( objects[i].selected ){
		        			objects[i].material = objects[i].materialBackup;
							objects[i].selected = false;
						}
	        		}
	        		// SELECT NEW ONE
	        		if(intersects[ 0 ].object.selected != true){
		        		selectedBlock = intersects[0];
						intersects[ 0 ].object.materialBackup = intersects[ 0 ].object.material;
						intersects[ 0 ].object.materialSelected = new THREE.MeshLambertMaterial({
							map: intersects[ 0 ].object.materialBackup.map,
							color: "red"
						});
						intersects[ 0 ].object.material = intersects[ 0 ].object.materialSelected;
						intersects[ 0 ].object.selected = true;
						// TODO Special case for camp (or other custom models) to consider materials array instead of single material
						// Alternativly: user materials array for simple meshs as well 
					}
        		}
        	} else {
        		// ADDING
        		if( selectedBlockType == 'blockType1' ){
					fieldHeight = 50;
					selectedMaterial.vertexColors = THREE.FaceColor;
					var block = new THREE.Mesh(	new THREE.CubeGeometry(50,fieldHeight,50), selectedMaterial	);
					setBlockPosition(block, intersects, intersectsGround);
				} else if ( selectedBlockType == 'blockType2'){
					fieldHeight = 50;
					selectedMaterial.vertexColors = THREE.FaceColor;
					var block = new THREE.Mesh(	new THREE.CylinderGeometry(25, 25, fieldHeight, 30, 1, false), selectedMaterial	);
					setBlockPosition(block, intersects, intersectsGround);
				} else if ( selectedBlockType == 'blockType3'){
					fieldHeight = 50;
					selectedMaterial.vertexColors = THREE.FaceColor;
					
					var loader = new THREE.JSONLoader();
			        loader.load( "models/ramp6.js", function( geometry, materials ) {
			        	var material = new THREE.MeshFaceMaterial( materials );
			        	material.materials[0] = selectedMaterial;
						var block = new THREE.Mesh(geometry, material);
						block.scale.x = block.scale.y = block.scale.z = 1;
						setBlockPosition(block, intersects, intersectsGround);
					});
				}
			}
		}
		console.log(objects);
	}
}

function deleteSelected(){
	// DELETING
	scene.remove(selectedBlock.object.outline);
	scene.remove(selectedBlock.object);
	for(i=0; i<objects.length; i++){
		if( objects[i].id == selectedBlock.object.id )
			objects.splice(i,1);
	}
	selectedBlock = null;
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

function setBlockPosition(block, intersects, intersectsGround){
	console.log(block);
	if ( intersects.length > 0 ) {
		// BLOCK ON BLOCK
		intersects[0].face.color.setRGB( 255, 0, 0);
		field = intersects[ 0 ].object;
		yPosition = fieldHeight/2;
		
		block.position.x = field.position.x;
		block.position.z = field.position.z;
		block.position.y = field.position.y;
		
		// TODO fix placement after rotation (when face 0 is not face at top anymore)
		// idea: project 3 rays to the block, one for each axis to determine the face at that side
		// other idea: keep track of the position of the faces during rotation
		console.log("faceindex: " + intersects[0].faceIndex);
		switch( intersects[0].faceIndex ){
			case 0: block.position.x += field.geometry.width; break;
			case 1: block.position.x += field.geometry.width; break;
			case 2: block.position.x -= field.geometry.width; break;
			case 3: block.position.x -= field.geometry.width; break;
			case 4: block.position.y += field.geometry.height; break;
			case 5: block.position.y += field.geometry.height; break;
			case 6: block.position.y -= field.geometry.height; break;
			case 7: block.position.y -= field.geometry.height; break;
			case 8: block.position.z += field.geometry.depth; break;
			case 9: block.position.z += field.geometry.depth; break;
			case 10: block.position.z -= field.geometry.depth; break;
			case 11: block.position.z -= field.geometry.depth; break;
			default: block.position.y += fieldHeight; break;
		}
		
		block.castShadow = true;
		block.receiveShadow = true;
		block.geometry.dynamic = true;
		
		// OUTLINE
		var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
		block.outline = new THREE.Mesh( block.geometry, outlineMaterial1 );
		block.outline.position = block.position;
		block.outline.scale.multiplyScalar(block.scale.x * 1.05);
		
		objects.push(block);
		scene.add(block);
		scene.add( block.outline );
			
	} else if ( intersectsGround.length > 0 ) {
		// BLOCK ON GROUND
		field = intersectsGround[ 0 ].object;
		yPosition = fieldHeight/2;
		outline = 2;
		
		block.position.x = field.position.x;
		block.position.z = field.position.z;
		block.position.y = field.position.y + yPosition + outline;
		
		block.castShadow = true;
		block.receiveShadow = true;
		block.geometry.dynamic = true;
		
		// OUTLINE
		var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
		block.outline = new THREE.Mesh( block.geometry, outlineMaterial1 );
		block.outline.position = block.position;
		block.outline.scale.multiplyScalar(block.scale.x * 1.05);
		
		objects.push(block);
		scene.add(block);
		scene.add( block.outline );
	}
}