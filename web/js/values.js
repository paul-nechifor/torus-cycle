// Constants that aren't important for gameplay.
var Const = {};

// Camera projection settings
Const.FOV = 60;
Const.NEAR = 1;
Const.FAR = 100;

// Camera offset settings
Const.ROTATIONS = [180, 90, 270];
Const.DISTANCES = [12, 26];
Const.ANGLES = [55, 40];
Const.ROTATION_SPEED = 8;
Const.DISTANCE_SPEED = 75;
Const.ANGLE_SPEED = 2;
Const.SUBJECT_DISTANCES = [1, 0, -1, 0];

// Shaddow settings
Const.SHADOW_DARKNESS = 0.8;
Const.SHADOW_NEAR = 1;
Const.SHADOW_FAR = 100;
Const.SHADOW_CAMERA_SIZE = 20;
Const.SHADOW_MAP_SIZE = 1024;

// Directions as quarter of tau
Const.RIGHT = 0;
Const.DOWN = 1;
Const.LEFT = 2;
Const.UP = 3;

// Other stuff
Const.TURN_SPEED = 8;
Const.TRAIL_HEIGHT = 0.8;
Const.LIGHT_SOURCE = new THREE.Vector3(5, 10, 5);
