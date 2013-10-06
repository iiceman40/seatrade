<html>
	<head>
		<title>SeaTrade</title>
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
		<script src="js/vendor/kinetic.js"></script>
		<script src="js/vendor/pathfinding.js"></script>
		
		
		<script type="text/javascript" src="js/lib/global.jquery.js"></script>
		<script type="text/javascript" src="js/lib/materials.jquery.js"></script>
		<script type="text/javascript" src="js/lib/models.jquery.js"></script>
		<script type="text/javascript" src="js/lib/effects.jquery.js"></script>
		
		<script type="text/javascript" src="js/lib/map.jquery.js"></script>
		
		<script type="text/javascript" src="js/lib/dock.jquery.js"></script>
		<script type="text/javascript" src="js/lib/castle.jquery.js"></script>
		<script type="text/javascript" src="js/lib/farm.jquery.js"></script>
		<script type="text/javascript" src="js/lib/town.jquery.js"></script>
		<script type="text/javascript" src="js/seatrade.jquery.js"></script>
		
		<script type="text/javascript" src="js/lib/ui.jquery.js"></script>
		<link rel="stylesheet" type="text/css" href="css/seatrade.css" />
	</head>
	<body>
		<div id="container"> </div>
		
		<div class="town-name"></div>
		
		<div class="castle-hud hud">
			<div class="blockMaterials">
				<div class="menuHeading">Material:</div>
			</div>
			<div class="blockFarmTypes">
			    <div class="menuHeading">blockFarmTypes:</div>
				<div class="blockType active" id="blockType1">Cube</div>
				<div class="blockType" id="blockType2">Cylinder</div>
				<div class="blockType" id="blockType3">Ramp</div>
			</div>
			<div class="blockActions">
				<div class="menuHeading">Rotate:</div>
				<div class="blockAction" id="rotateX">around X axis</div>
				<div class="blockAction" id="rotateY">around Y axis</div>
				<div class="blockAction" id="rotateZ">around Z axis</div>
				<div class="menuHeading">Modify:</div>
				<div class="blockAction" id="deleteSelected">Delete</div>
			</div>
			<button class="backToTownFromCastle">&lt; Back to Town</button>
		</div>
		
		<div class="farm-hud hud">
			<div class="farm-types">
			    <div class="menuHeading">Storage:</div>
			    <div>Wheat: <span class="wheatBarn">-</span></div>
			    <div class="menuHeading">Farm types:</div>
			</div>
			<button class="backToTownFromFarm">&lt; Back to Town</button>
		</div>
		<div class="screenshot"> </div>
		
		<div class="map-area">
            <div id="mapcontainer"> </div>
            <button class="backToDock">&lt; Back to Dock</button>
        </div>
        
	</body>
</html>