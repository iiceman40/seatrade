function initCastleUI(){
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