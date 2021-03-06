//////////////////////////////////////
// TEXTURES AND MATERIAL			//
//////////////////////////////////////

/*
 * TOWN
 */
function loadTownMaterials(){
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
}


/*
 * CASTLE
 */
function loadCastleMaterials(){
	
	var materialFloor = new THREE.MeshLambertMaterial({
		wireframe: true,
		color: 'black'
	});
	
	var gras = new THREE.ImageUtils.loadTexture("textures/gras.jpg");
	gras.wrapS = gras.wrapT = THREE.RepeatWrapping;
	gras.repeat.set( rows*10, columns*10 );
	var materialGround = new THREE.MeshLambertMaterial({
		map: gras
	});
	
	var cobbleTexture = new THREE.ImageUtils.loadTexture("textures/cobble_cut.jpg"); // TODO better not cut?
	cobbleTexture.anisotropy = maxAnisotropy;
	materialStoneWall = new THREE.MeshLambertMaterial({
		map: cobbleTexture,
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
	
	var materials = new Object();
	materials['materialStoneWall'] = materialStoneWall;
	materials['materialCrate1'] = materialCrate1;
	materials['materialCrate2'] = materialCrate2;
	materials['materialDarkWood'] = materialDarkWood;
	materials['materialHay'] = materialHay;
	
	$.each(materials, function(key, value) {
		if($('#'+key).length == 0)
			$('.blockMaterials').append('<div class="blockMaterial" id="'+key+'">'+key+'</div>');
	});
	
	// materials which are not selectable
	materials['materialFloor'] = materialFloor;
	materials['materialGround'] = materialGround;
	
	selectedMaterial = materialStoneWall; // make it default material
	$('#materialStoneWall').addClass('active');
	
	return materials;
}

/*
 * CASTLE
 */
function loadFarmMaterials(){
	
	var materialFloor = new THREE.MeshLambertMaterial({
		wireframe: true,
		color: 'black'
	});
	
	var gras = new THREE.ImageUtils.loadTexture("textures/gras.jpg");
	gras.wrapS = gras.wrapT = THREE.RepeatWrapping;
	gras.repeat.set( rows*10, columns*10 );
	var materialGround = new THREE.MeshLambertMaterial({
		map: gras
	});
	
	materialBananas = new THREE.MeshLambertMaterial({
		color: 0xffe20a
	});
	materialWheat = new THREE.MeshLambertMaterial({
		color: 0xcaa561
	});
	materialGrapes = new THREE.MeshLambertMaterial({
		color: 0x72158e
	});
	
	var materials = new Object();
	materials['Bananas'] = materialBananas;
	materials['Wheat'] = materialWheat;
	materials['Grapes'] = materialGrapes;
	
	$.each(materials, function(key, value) {
		if($('#'+key).length == 0)
			$('.farm-types').append('<div class="blockFarmType" id="'+key+'">'+key+'</div>');
	});
	
	// materials which are not selectable
	materials['materialFloor'] = materialFloor;
	materials['materialGround'] = materialGround;
	
	selectedMaterial = materialBananas; // make it default material
	$('#materialBananas').addClass('active');
	
	return materials;
}