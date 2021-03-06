<html>
	<head>
		<title>SeaTrade - Castle</title>
		<meta http-equiv="content-type" content="text/html; charset=UTF-8">
		
		<script type="x-shader/x-vertex" id="vertexShader">
			varying vec3 vWorldPosition;
			void main() {
				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
				vWorldPosition = worldPosition.xyz;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}
		</script>
		<script type="x-shader/x-fragment" id="fragmentShader">
			uniform vec3 topColor;
			uniform vec3 bottomColor;
			uniform float offset;
			uniform float exponent;
			varying vec3 vWorldPosition;
			void main() {
				float h = normalize( vWorldPosition + offset ).y;
				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( h, exponent ), 0.0 ) ), 1.0 );
			}
		</script>
		
		<script type="text/javascript" src="js/vendor/jquery-min.js"></script>
		<script src="js/vendor/three.min.js"></script>
		<script src="js/vendor/OrbitControls.js"></script>
		<script src="js/vendor/tween.min.js"></script>
		<script type="text/javascript" src="js/castle.jquery.js"></script>
		<link rel="stylesheet" type="text/css" href="css/seatrade.css" />
	</head>
	<body>
		<div id="container"> </div>
		
		<div class="castle-hud hud" style="display:block;">
			<div class="blockMaterials">
				<div class="menuHeading">Material:</div>
			</div>
			<div class="block-types">
			    <div class="menuHeading">Block-Types:</div>
				<div class="block-type active" id="blockType1">Cube</div>
				<div class="block-type" id="blockType2">Cylinder</div>
				<div class="block-type" id="blockType3">Ramp</div>
			</div>
			<div class="blockActions">
				<div class="menuHeading">Rotate:</div>
				<div class="blockAction" id="rotateX">around X axis</div>
				<div class="blockAction" id="rotateY">around Y axis</div>
				<div class="blockAction" id="rotateZ">around Z axis</div>
				<div class="menuHeading">Modify:</div>
				<div class="blockAction" id="deleteSelected">Delete</div>
			</div>
		</div>
		
		<div class="farm-hud hud">
			<div class="farm-types">
				<div class="block-type active" id="farmType1">Cattle</div>
				<div class="block-type" id="farmType2">Wheat</div>
				<div class="block-type" id="farmType3">Bananas</div>
				<div class="block-type" id="farmType4">Grapes</div>
			</div>
		</div>
		<div class="screenshot"> </div>
		
	</body>
</html>