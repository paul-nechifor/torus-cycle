// Constants that aren't important for gameplay.
const Const = {
    // Camera projection settings
    FOV: 60,
    NEAR: 1,
    FAR: 100,

    // Camera offset settings
    ROTATIONS: [180, 90, 270],
    DISTANCES: [12, 26],
    ANGLES: [55, 40],
    ROTATION_SPEED: 8,
    DISTANCE_SPEED: 75,
    ANGLE_SPEED: 2,
    SUBJECT_DISTANCES: [1, 0, -1, 0],

    // Shaddow settings
    SHADOW_DARKNESS: 0.8,
    SHADOW_NEAR: 1,
    SHADOW_FAR: 100,
    SHADOW_CAMERA_SIZE: 20,
    SHADOW_MAP_SIZE: 1024,

    // Directions as quarter of tau
    RIGHT: 0,
    DOWN: 1,
    LEFT: 2,
    UP: 3,

    // Other stuff
    TURN_SPEED: 8,
    TRAIL_HEIGHT: 0.8,
    LIGHT_SOURCE: new THREE.Vector3(5, 10, 5),
};

export {Const as default};
