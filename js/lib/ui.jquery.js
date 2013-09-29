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