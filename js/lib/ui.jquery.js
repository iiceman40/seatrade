function initCastleUI(materials){
	
	$('.blockMaterial').click(function(){
		id = $(this).attr('id');
		selectedMaterial = materials[id]
		$('.blockMaterial').removeClass('active');
		$(this).addClass('active');
	});
	
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
	
	$('.backToTownFromCastle').click(function() {
		$('.castle-hud').fadeOut(1000);
		$('#container').fadeOut(1000, function(){
			initTown("castle");
		});
	});
}

function initDockUI(){
	if( $('.ship-selector').length == 0 ){
		$('body').append(
			'<div class="ship-selector">' +
				'<div class="selected-ships"></div>' +
				'<div class="fleet">' +
					'<span class="ship">SHIP</span>' +
				'</div>' +
				'<button class="backToTown">&lt; Back to Town</button>' +
				'<button class="map">Map &gt;</button>' +
			'</div>'
		);
		$('.ship-selector').fadeIn(500);
	}
	
	$('.ship-selector .fleet .ship').click(function(){
		$(this).appendTo('.selected-ships');
		// TODO save id of selected ships in an array
		$('.ship-selector .selected-ships .ship').click(function(){
			$(this).appendTo('.fleet');
			// TODO remove id of selected ships from array
		});
	});
	$('.ship-selector button.map').click(function(){
		$('.ship-selector').fadeOut(0, function(){
			$('.ship-selector').remove();
			$('.map-area').fadeIn(0);
		});
	});
	$('.backToTown').click(function() {
		$('.ship-selector').fadeOut(500, function(){
			$('.ship-selector').remove();
			target = { x : 70, y: 30, z: 300 };
			cameraTo(target, 1000);
			activeArea = "town";
		});
	});
}

function initMapUI(){
	$('.backToDock').click(function() {
		$('.map-area').fadeOut(0);
		initDockUI();
	});
}