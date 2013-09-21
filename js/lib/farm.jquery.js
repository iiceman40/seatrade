$(document).ready(function() {
	var clientClickX, clientClickY;
	
	var container;

	var camera, scene, renderer, objects;
	var particleLight, pointLight;

	var clock = new THREE.Clock();
	var maxAnisotropy = 1;
	
	var materialWall;

	var ground = [];
	var objects = [];
	var light;
	
	// NEW
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
	
	$('.block-type').click(function() {
		selectedBlockType = $(this).attr('id');
		$('.block-type').removeClass('active');
		$(this).addClass('active');
		console.log( selectedBlockType );
	});
	
	$('#deleteSelected').click(function() {
		if( selectedBlock != null ){
			deleteSelected();
		}
	});
	$('#rotateX').click(function() {
		if( selectedBlock != null ){
			rotateX();
		}
	});
	$('#rotateY').click(function() {
		if( selectedBlock != null ){
			rotateY();
		}
	});
	$('#rotateZ').click(function() {
		if( selectedBlock != null ){
			rotateZ();
		}
	});

	init();
	animate();
	

	function init() {

		container = document.createElement( 'div' );
		document.body.appendChild( container );

		scene = new THREE.Scene();
		
		// Camera
		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.position.set( 0, 200, 200 );
		camera.lookAt(scene.position);

		controls = new THREE.OrbitControls( camera );
		
		//////////////////////////////////////
		// RENDERER							//
		//////////////////////////////////////
		renderer = new THREE.WebGLRenderer({antialias:true, transparent: true, preserveDrawingBuffer: true});
		
		// enable shadows on the renderer
	    renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		renderer.physicallyBasedShading = true;
		maxAnisotropy = renderer.getMaxAnisotropy();
	    // to antialias the shadow
		//renderer.shadowMapSoft = true;
	    
		renderer.setSize( window.innerWidth, window.innerHeight );
		
		// TEXTURES AND MATERIAL
		var gras = new THREE.ImageUtils.loadTexture("textures/gras.jpg");
		
		var grasLarge = gras;
		grasLarge.wrapS = grasLarge.wrapT = THREE.RepeatWrapping;
		grasLarge.repeat.set( rows*10, columns*10 );
		
		var grasSmall = gras;
		
		var materialFloor = new THREE.MeshLambertMaterial({
			wireframe: true,
			color: 'black'
			//map: grasSmall
		});
		
		var materialGround = new THREE.MeshLambertMaterial({
			map: grasLarge
		});
		
		var cobbleTexture = new THREE.ImageUtils.loadTexture("textures/cobble_cut.jpg"); // TODO better not cut?
		cobbleTexture.anisotropy = maxAnisotropy;
		materialStoneWall = new THREE.MeshLambertMaterial({
			color: 'gray',
			map: cobbleTexture,
			vertexColors: THREE.FaceColors
		});
		$('.blockMaterials').append('<div class="blockMaterial active" id="materialStoneWall">Cobble</div>');
		$('#materialStoneWall').click(function(){
			selectedMaterial = materialStoneWall;
			$('.blockMaterial').removeClass('active');
			$(this).addClass('active');
		});
		selectedMaterial = materialStoneWall; // make it default material
		
		var crateTexture = new THREE.ImageUtils.loadTexture("textures/crate.jpg");
		crateTexture.anisotropy = maxAnisotropy;
		var materialCrate1 = new THREE.MeshLambertMaterial({
			map: crateTexture
		});
		$('.blockMaterials').append('<div class="blockMaterial" id="materialCrate1">Wood/Crate1</div>');
		$('#materialCrate1').click(function(){
			selectedMaterial = materialCrate1;
			$('.blockMaterial').removeClass('active');
			$(this).addClass('active');
		});
		
		var crate2Texture = new THREE.ImageUtils.loadTexture("textures/crate2.jpg");
		crate2Texture.anisotropy = maxAnisotropy;
		var materialCrate2 = new THREE.MeshLambertMaterial({
			map: crate2Texture
		});
		$('.blockMaterials').append('<div class="blockMaterial" id="materialCrate2">Wood/Crate2</div>');
		$('#materialCrate2').click(function(){
			selectedMaterial = materialCrate2;
			$('.blockMaterial').removeClass('active');
			$(this).addClass('active');
		});
		
		var darkwoodTexture = new THREE.ImageUtils.loadTexture("textures/darkwood.jpg");
		darkwoodTexture.anisotropy = maxAnisotropy;
		var materialDarkWood = new THREE.MeshLambertMaterial({
			map: darkwoodTexture
		});
		$('.blockMaterials').append('<div class="blockMaterial" id="materialDarkWood">Dark Wood</div>');
		$('#materialDarkWood').click(function(){
			selectedMaterial = materialDarkWood;
			$('.blockMaterial').removeClass('active');
			$(this).addClass('active');
		});
		
		var hayTexture = new THREE.ImageUtils.loadTexture("textures/hay.jpg");
		hayTexture.anisotropy = maxAnisotropy;
		var materialHay = new THREE.MeshLambertMaterial({
			map: hayTexture
		});
		$('.blockMaterials').append('<div class="blockMaterial" id="materialHay">Hay</div>');
		$('#materialHay').click(function(){
			selectedMaterial = materialHay;
			$('.blockMaterial').removeClass('active');
			$(this).addClass('active');
		});
		
		// MAIN GROUND PALNE
		var mainground = new THREE.Mesh( new THREE.PlaneGeometry( 50000, 50000 ), materialGround );
		mainground.rotation.x = - Math.PI / 2;
		mainground.position.x = 0;
		mainground.position.z = 0;
		mainground.position.y = 0;
		mainground.receiveShadow = true;
		scene.add( mainground );
		
		for(i=0;i<rows;i++){
			for(j=0;j<columns;j++){
				yPosition = 1
				
				var field = new THREE.Mesh( new THREE.PlaneGeometry( 50, 50 ), materialFloor );
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
		
		
		
		//////////////////////////////////////
		// LIGHT AND SHADOWS				//
		//////////////////////////////////////
		// add subtle blue ambient lighting
		//var ambientLight = new THREE.AmbientLight(0x111111);
		//scene.add(ambientLight);
		
		//directions light
		light =  new THREE.DirectionalLight( 0xffeeee, 1.5 );
	    light.position.set( 170, 500, -160 );
	    light.shadowDarkness = 0.2;
	    //light.shadowCameraVisible = true;
	    light.shadowMapWidth = 1024; // default is 512
		light.shadowMapHeight = 1024; // default is 512
		
		// enable shadows for a light
	    light.castShadow = true;
	    
	    scene.add(light);
	    
	    ambientLight = new THREE.AmbientLight(0x333333);
		ambientLight.intensity = 0.1;
		scene.add( ambientLight );
		
		
		hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6, 1, 0.6 );
		hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );
		
		
		// SKYDOME

		var vertexShader = document.getElementById( 'vertexShader' ).textContent;
		var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
		var uniforms = {
			topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
			bottomColor: { type: "c", value: new THREE.Color( 0xffffff ) },
			offset:		 { type: "f", value: 33 },
			exponent:	 { type: "f", value: 0.6 }
		}
		uniforms.topColor.value.copy( hemiLight.color );
		
		// FOG
		scene.fog = new THREE.Fog( 0xffffff, 1, 5000 );
		scene.fog.color.setHSL( 0.6, 0, 1 );
		scene.fog.color.copy( uniforms.bottomColor.value );

		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );

		var sky = new THREE.Mesh( skyGeo, skyMat );
		scene.add( sky );
				
				

		projector = new THREE.Projector();
		
		
		// append renderer
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		//document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		window.addEventListener( 'resize', onWindowResize, false );
		
		// screenshot
		window.addEventListener("keyup", function(e){
		    var imgData, imgNode;
		    //Listen to 'P' key
		    if(e.which !== 80) return;  
		    try {
		        imgData = renderer.domElement.toDataURL();      
		        console.log(imgData);
		    } 
		    catch(e) {
		        console.log("Browser does not support taking screenshot of 3d context");
		        return;
		    }
		   imgNode = document.createElement("img");
		   imgNode.src = imgData;
		   $('.screenshot').html(imgNode);
		});

	}

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
						}
	        		}
	        	} else {
	        		// ADDING
	        		var loader = new THREE.JSONLoader();
	        		if( selectedBlockType == 'blockType1' ){
						loader.load( "models/cow.js", function( geometry, materials ) {
				        	var material = new THREE.MeshFaceMaterial( materials );	
							// cow
							cow = new THREE.SkinnedMesh( geometry, material, false  );
				            cow.scale.x = cow.scale.y = cow.scale.z = 5
				            //cow.doubleSided = true;
				            cow.castShadow = true;
				            cow.recieveShadow = true;
				            cow.position = intersectsGround[0].object.position;
				            cow.position.y += 15;
				            cow.rotation.y = -Math.PI/2
				            scene.add(cow);
				            
				            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
							cow.outline = new THREE.Mesh( geometry, outlineMaterial1 );
							cow.outline.position = cow.position;
							cow.outline.rotation.y = cow.rotation.y;
							cow.outline.scale.multiplyScalar(5.1);
							scene.add( cow.outline );
							
							objects.push(cow);
				        } );
					} 
					
				}
			}
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

			if ( intersects.length > 0 ) {
				field = intersects[ 0 ].object;
				
				console.log( intersects[0] );
				intersects[0].object.geometry.__dirtyColors = true;
				//intersects[0].face.color = new THREE.Color(0xf2b640);
				intersects[0].face.color.setRGB( Math.random(), Math.random(), Math.random())
				
			} 		
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


	//////////////////////////////////////
	// ANIMATION						//
	//////////////////////////////////////
	var t = 0;
	function animate(t) {
		//litCube = objects[1];
		light.position.x = Math.cos(t/6000)*850;
		light.position.z = Math.sin(t/6000)*850;
		
		// controls
		controls.update();
		
	    renderer.render(scene, camera);
	    requestAnimationFrame( animate );
	};
	animate(new Date().getTime());
	
	
	/*
	 * FUNCTIONS
	 */
	
	
	
});