$(document).ready(function() {
	var clientClickX, clientClickY;
	var hoveringOver = null;
	
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
		camera.position.set( 150, 150, 400 );
		camera.lookAt(scene.position);
		
		// TWEENING
		var position = { x : 150, y: 150, z: 400 };
		var target = { x : 70, y: 30, z: 300 };
		var tween = new TWEEN.Tween(position).to(target, 2000);
		
		tween.onUpdate(function(){
		    camera.position.x = position.x;
		    camera.position.y = position.y;
		    camera.position.z = position.z;
		    camera.lookAt(scene.position);
		});
		tween.delay(2000)
		tween.start();
		
		
		//////////////////////////////////////
		// RENDERER							//
		//////////////////////////////////////
		renderer = new THREE.WebGLRenderer({antialias:true, transparent: true, preserveDrawingBuffer: true});
		
		// enable shadows on the renderer
	    renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		renderer.physicallyBasedShading = true;
		renderer.setSize( window.innerWidth, window.innerHeight );
		maxAnisotropy = renderer.getMaxAnisotropy();
		
		//////////////////////////////////////
		// TEXTURES AND MATERIAL			//
		//////////////////////////////////////
		var gras = new THREE.ImageUtils.loadTexture("textures/gras.jpg");
		
		var grasLarge = gras;
		grasLarge.wrapS = grasLarge.wrapT = THREE.RepeatWrapping;
		grasLarge.repeat.set( rows, columns );
		
		var grasSmall = gras;
		
		var materialFloor = new THREE.MeshLambertMaterial({
			wireframe: true,
			color: 'black'
			//map: grasSmall
		});
		
		var materialGround = new THREE.MeshLambertMaterial({
			map: grasLarge
		});
		
		var waterTexture = new THREE.ImageUtils.loadTexture("textures/water.jpg");
		waterTexture.anisotropy = maxAnisotropy;
		waterTexture.wrapS = waterTexture.wrapT = THREE.RepeatWrapping;
		waterTexture.repeat.set( 50, 5 );
		materialWater = new THREE.MeshLambertMaterial({
			map: waterTexture,
			vertexColors: THREE.FaceColors
		});
		
		var cobbleTexture = new THREE.ImageUtils.loadTexture("textures/cobble_cut.jpg"); // TODO better not cut?
		cobbleTexture.anisotropy = maxAnisotropy;
		cobbleTexture.wrapS = cobbleTexture.wrapT = THREE.RepeatWrapping;
		cobbleTexture.repeat.set( 300, 30 );
		materialStoneWall = new THREE.MeshLambertMaterial({
			map: cobbleTexture,
			vertexColors: THREE.FaceColors
		});
		
		var crateTexture = new THREE.ImageUtils.loadTexture("textures/crate.jpg");
		crateTexture.anisotropy = maxAnisotropy;
		var materialCrate1 = new THREE.MeshLambertMaterial({
			map: crateTexture
		});
		
		var crate2Texture = new THREE.ImageUtils.loadTexture("textures/crate2.jpg");
		crate2Texture.anisotropy = maxAnisotropy;
		var materialCrate2 = new THREE.MeshLambertMaterial({
			map: crate2Texture
		});
		
		var darkwoodTexture = new THREE.ImageUtils.loadTexture("textures/darkwood.jpg");
		darkwoodTexture.anisotropy = maxAnisotropy;
		var materialDarkWood = new THREE.MeshLambertMaterial({
			map: darkwoodTexture
		});
		
		var hayTexture = new THREE.ImageUtils.loadTexture("textures/hay.jpg");
		hayTexture.anisotropy = maxAnisotropy;
		var materialHay = new THREE.MeshLambertMaterial({
			map: hayTexture
		});
		
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
		
		
		
		//////////////////////////////////////
		// LIGHT AND SHADOWS				//
		//////////////////////////////////////
		// add subtle blue ambient lighting
		//var ambientLight = new THREE.AmbientLight(0x111111);
		//scene.add(ambientLight);
		
		//directions light
		light =  new THREE.DirectionalLight( 0xffeeee, 1 );
	    light.position.set( -100, 200, -300 );
	    light.shadowDarkness = 0.85;
	    //light.shadowCameraVisible = true;
	    //light.shadowMapWidth = 1024; // default is 512
		//light.shadowMapHeight = 1024; // default is 512
		
		// enable shadows for a light
	    light.castShadow = true;
	    
	    scene.add(light);
		
		
		hemiLight = new THREE.HemisphereLight( 0xFF9F2B, 0xFF9F2B, 0.8 );
		//hemiLight.color.setHSL( 0.6, 1, 0.6 );
		//hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );
		
		// lens flare
		var textureFlare0 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare0.png" );
		var textureFlare2 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare2.png" );
		var textureFlare3 = THREE.ImageUtils.loadTexture( "textures/lensflare/lensflare3.png" );

		addLight( 0.55, 0.9, 0.5, 0, 250, -400 );
		function addLight( h, s, l, x, y, z ) {

			var light = new THREE.PointLight( 0xffffff, 1.5, 4500 );
			light.color.setHSL( h, s, l );
			light.position.set( x, y, z );
			scene.add( light );

			var flareColor = new THREE.Color( 0xffffff );
			flareColor.setHSL( h, s, l + 0.5 );

			var lensFlare = new THREE.LensFlare( textureFlare0, 350, 0.0, THREE.AdditiveBlending, flareColor );
/*
			lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
			lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
			lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
*/
			lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
			lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
			lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
			lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

			lensFlare.customUpdateCallback = lensFlareUpdateCallback;
			lensFlare.position = light.position;

			scene.add( lensFlare );

		}
		
		
		// SKYDOME TODO FIX BACKGROUND IMAGE
		// FOG
		scene.fog = new THREE.Fog( 0xE27109, 100, 1200 );
		//scene.fog.color.copy( uniforms.bottomColor.value );
		
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
		
		var skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
		var skyMat = new THREE.ShaderMaterial( { 
			vertexShader: vertexShader, 
			fragmentShader: fragmentShader, 
			uniforms: uniforms, 
			side: THREE.BackSide,
		} );
		var sky = new THREE.Mesh( skyGeo, skyMat );
		scene.add( sky );
		
		var skyTexture = new THREE.ImageUtils.loadTexture("images/sunset.jpg");
		var skyGeo = new THREE.CubeGeometry( 10000, 1000, 1000 );
		var skyMat = new THREE.MeshBasicMaterial( { 
			map: skyTexture,
			side: THREE.BackSide
		} );
		var sky = new THREE.Mesh( skyGeo, skyMat );
		scene.add( sky );

		
		
				
		//////////////////////////////////////
		// LOADING MODELS					//
		//////////////////////////////////////
        var loader = new THREE.JSONLoader();
        loader.load( "models/house_001.js", function( geometry, materials ) {
        	var material = new THREE.MeshFaceMaterial( materials );
        	
        	// house 1
            house1 = new THREE.SkinnedMesh( geometry, material, false  );
            house1.scale.x = house1.scale.y = house1.scale.z = 15
            //house1.doubleSided = true;
            house1.castShadow = true;
            house1.recieveShadow = true;
            house1.position.x = -120;
            house1.position.z = 0;
            house1.position.y = 0;
            scene.add(house1);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			house1.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			house1.outline.position = house1.position;
			house1.outline.scale.multiplyScalar(15.2);
			scene.add( house1.outline );
			
			objects.push(house1);
			
			// house2
			house2 = new THREE.SkinnedMesh( geometry, material, false  );
            house2.scale.x = house2.scale.y = house2.scale.z = 15
            //house2.doubleSided = true;
            house2.castShadow = true;
            house2.recieveShadow = true;
            house2.position.x = 120;
            house2.position.z = 0;
            house2.position.y = 0;
            scene.add(house2);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			house2.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			house2.outline.position = house2.position;
			house2.outline.scale.multiplyScalar(15.2);
			scene.add( house2.outline );
			
			objects.push(house2);
			
			// house3
			house3 = new THREE.SkinnedMesh( geometry, material, false  );
            house3.scale.x = house3.scale.y = house3.scale.z = 15
            //house3.doubleSided = true;
            house3.castShadow = true;
            house3.recieveShadow = true;
            house3.position.x = -130;
            house3.position.z = 190;
            house3.position.y = 0;
            house3.rotation.y = Math.PI/2;
            scene.add(house3);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			house3.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			house3.outline.position = house3.position;
			house3.outline.rotation.y = house3.rotation.y;
			house3.outline.scale.multiplyScalar(15.2);
			scene.add( house3.outline );
			
			objects.push(house3);
		});
		
		loader.load( "models/house_002.js", function( geometry, materials ) {
        	var material = new THREE.MeshFaceMaterial( materials );	
			// house4
			house4 = new THREE.SkinnedMesh( geometry, material, false  );
            house4.scale.x = house4.scale.y = house4.scale.z = 7
            //house4.doubleSided = true;
            house4.castShadow = true;
            house4.recieveShadow = true;
            house4.position.x = 160;
            house4.position.z = 190;
            house4.position.y = 0;
            house4.rotation.y = -Math.PI/25*10;
            scene.add(house4);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			house4.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			house4.outline.position = house4.position;
			house4.outline.rotation.y = house4.rotation.y;
			house4.outline.scale.multiplyScalar(7.05);
			scene.add( house4.outline );
			
			objects.push(house4);
        } );
        
        loader.load( "models/cart.js", function( geometry, materials ) {
        	var material = new THREE.MeshFaceMaterial( materials );	
			// house4
			cart = new THREE.SkinnedMesh( geometry, material, false  );
            cart.scale.x = cart.scale.y = cart.scale.z = 20
            //cart.doubleSided = true;
            cart.castShadow = true;
            cart.recieveShadow = true;
            cart.position.x = -70;
            cart.position.z = 70;
            cart.position.y = 0;
            cart.rotation.y = -Math.PI/25*10;
            cart.switchTo = "farm";
            scene.add(cart);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			cart.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			cart.outline.position = cart.position;
			cart.outline.rotation.y = cart.rotation.y;
			cart.outline.scale.multiplyScalar(20.5);
			scene.add( cart.outline );
			
			objects.push(cart);
        } );
        loader.load( "models/horse.js", function( geometry, materials ) {
        	var material = new THREE.MeshFaceMaterial( materials );	
			// house4
			horse = new THREE.SkinnedMesh( geometry, material, false  );
            horse.scale.x = horse.scale.y = horse.scale.z = 15
            //horse.doubleSided = true;
            horse.castShadow = true;
            horse.recieveShadow = true;
            horse.position.x = 130;
            horse.position.z = 230;
            horse.position.y = 0;
            horse.rotation.y = Math.PI;
            horse.switchTo = "castle";
            scene.add(horse);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			horse.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			horse.outline.position = horse.position;
			horse.outline.rotation.y = horse.rotation.y;
			horse.outline.scale.multiplyScalar(15.2);
			scene.add( horse.outline );
			
			objects.push(horse);
        } );
        
        /* TODO a well in the center of a town
        loader.load( "models/well.js", function( geometry, materials ) {
        	var material = new THREE.MeshFaceMaterial( materials );	
			// house4
			well = new THREE.SkinnedMesh( geometry, material, false  );
            well.scale.x = well.scale.y = well.scale.z = 0.5
            //well.doubleSided = true;
            well.castShadow = true;
            well.recieveShadow = true;
            well.position.x = 0;
            well.position.z = 200;
            well.position.y = 0;
            well.rotation.y = -Math.PI/25*10;
            scene.add(well);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			well.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			well.outline.position = well.position;
			well.outline.rotation.y = well.rotation.y;
			well.outline.scale.multiplyScalar(0.505);
			scene.add( well.outline );
			
			objects.push(well);
        } );
        */
		
		//ship
		var loader = new THREE.JSONLoader();
        var mesh;
        loader.load( "models/sailingship.js", function( geometry, materials ) {
        	//var material = new THREE.MeshFaceMaterial( materials );
        	var material = new THREE.MeshLambertMaterial({
				color: '#111'
			});
        	
        	// house 1
            ship = new THREE.SkinnedMesh( geometry, material, false  );
            ship.scale.x = ship.scale.y = ship.scale.z = 250
            //house1.doubleSided = true;
            ship.castShadow = true;
            ship.recieveShadow = true;
            ship.position.x = -50;
            ship.position.z = -180;
            ship.position.y = 0;
            ship.rotation.y = Math.PI/5;
            scene.add(ship);
            
            var outlineMaterial1 = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.BackSide } );
			ship.outline = new THREE.Mesh( geometry, outlineMaterial1 );
			ship.outline.position = ship.position;
			ship.outline.scale.multiplyScalar(250.8);
			ship.outline.rotation.y = ship.rotation.y;
			scene.add( ship.outline );
			
			objects.push(ship);
		});

		projector = new THREE.Projector();
		
		
		// append renderer
		container.appendChild( renderer.domElement );

		document.addEventListener( 'mousedown', onDocumentMouseDown, false );
		document.addEventListener( 'mouseup', onDocumentMouseUp, false );
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

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
		
		// start animation
		//controls.animation.play( false, 0 );
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
		
				var intersects = raycaster.intersectObjects( objects );
				console.log(intersects);
				
				if ( intersects.length > 0 ) {
					// TWEENING
					var position = {x: camera.position.x, y: camera.position.y, z: camera.position.z};
					var target = {x: intersects[0].object.position.x, y: intersects[0].object.position.y+30, z: intersects[0].object.position.z};
					var tween = new TWEEN.Tween(position).to(target, 1000);
					
					tween.onUpdate(function(){
					    camera.position.x = position.x;
					    camera.position.y = position.y;
					    camera.position.z = position.z;
					});
					tween.start();
					$('canvas').fadeOut(1000, function(){
						console.log(intersects[0].object.switchTo);
						switch( intersects[0].object.switchTo ){
							case 'farm': loadFarm(); break;
							case 'castle': loadCastle(); break;
							default: break;
						}
					});
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
	
	//////////////////////////////////////
	// ANIMATION						//
	//////////////////////////////////////
	function animate() {
		requestAnimationFrame( animate );
		render();
	}

	function render() {
		var delta = clock.getDelta();

		THREE.AnimationHandler.update( delta );
		//camera.lookAt(scene.position);
		
		TWEEN.update();

		//controls.update( delta );
		renderer.render( scene, camera );

	}
	
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
	
	
	function loadFarm(){
		$.getScript("js/farm.jquery.js", function(){
			console.log('farm loaded');
			$('.hud').hide();
			$('.farm-hud').show();
		});
	}
	function loadCastle(){
		$.getScript("js/castle.jquery.js", function(){
			console.log('castle loaded');
			$('.hud').hide();
			$('.castle-hud').show();
		});
	}
});