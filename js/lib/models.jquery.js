function loadTownModels(){
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
    
    // TODO a well in the center of a town
	
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
}
