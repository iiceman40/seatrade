function initSunset(){	
	//////////////////////////////////////
	// FOG, LIGHT AND SHADOWS			//
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
		
		lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
		lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );

		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position = light.position;

		scene.add( lensFlare );
	}
	
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
	
	console.log('sunset created');
}