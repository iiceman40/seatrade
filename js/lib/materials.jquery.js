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
	
	var crate2Texture = new THREE.ImageUtils.loadTexture("textures/crate2.jpg");
	crate2Texture.anisotropy = maxAnisotropy;
	var materialCrate2 = new THREE.MeshLambertMaterial({
		map: crate2Texture
	});
	$('.blockMaterials').append('<div class="blockMaterial" id="materialCrate2">Wood/Crate2</div>');
	
	var darkwoodTexture = new THREE.ImageUtils.loadTexture("textures/darkwood.jpg");
	darkwoodTexture.anisotropy = maxAnisotropy;
	var materialDarkWood = new THREE.MeshLambertMaterial({
		map: darkwoodTexture
	});
	$('.blockMaterials').append('<div class="blockMaterial" id="materialDarkWood">Dark Wood</div>');
	
	var hayTexture = new THREE.ImageUtils.loadTexture("textures/hay.jpg");
	hayTexture.anisotropy = maxAnisotropy;
	var materialHay = new THREE.MeshLambertMaterial({
		map: hayTexture
	});
	$('.blockMaterials').append('<div class="blockMaterial" id="materialHay">Hay</div>');
	
	var materials = new Object();
	materials['materialFloor'] = materialFloor;
	materials['materialGround'] = materialGround;
	materials['materialCrate1'] = materialCrate1;
	materials['materialCrate2'] = materialCrate2;
	materials['materialDarkWood'] = materialDarkWood;
	materials['materialHay'] = materialHay;
	
	return materials;
}