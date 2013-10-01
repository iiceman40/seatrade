function initCastleUI(materials){
	console.log('initiatin UI...')
	
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
	
}

function initDockUI(){
	if( $('.ship-selector').length == 0 ){
		$('body').append(
			'<div class="ship-selector">' +
				'<div class="selected-ships"></div>' +
				'<div class="fleet">' +
					'<span class="ship">SHIP</span>' +
				'</div>' +
				'<button class="map">Map &gt;</button>' +
			'</div>'
		);
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
		$('.ship-selector').remove();
		if( $('.map-area').length == 0 ){
			$('body').append(
				'<div class="map-area">' +
					'<div id="mapcontainer"> </div>' +
				'</div>'
			);
		}
		initMap();
	})
}