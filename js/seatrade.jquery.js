$(document).ready(function() {
	//initMap();
	//initCanvasAndRenderer();
	//initTown();
	initTown();
	animate();
	
	// append renderer
	var container = $('#container')[0];
	container.appendChild( renderer.domElement );

	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mouseup', onDocumentMouseUp, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

	window.addEventListener( 'resize', onWindowResize, false );
	
	// screenshot
	window.addEventListener("keyup", function(e){
	    var imgData, imgNode;
	    // Listen to 'P' key
	    if(e.which !== 80) return;  
	    try {
	        imgData = renderer.domElement.toDataURL();      
	    } 
	    catch(e) {
	        console.log("Browser does not support taking screenshot of 3d context");
	        return;
	    }
	   imgNode = document.createElement("img");
	   imgNode.src = imgData;
	   $('.screenshot').html(imgNode);
	});
});