import config from './config';
import {changesSign} from './utils';
import CameraController from './CameraController';
import Computer from './Computer';
import Player from './Player';
import Resources from './Resources';
import Const from './Const';

var width, height, camera, light, scene, renderer, subject, cameraController, resources, computer, clock;

function init(container) {
    width = window.innerWidth;
    height = window.innerHeight;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(Const.FOV, width / height,
            Const.NEAR, Const.FAR);
    clock = new THREE.Clock();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);

    light = new THREE.DirectionalLight(0xFFFFFF, 1);
    setUpShadow(true);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x333333));

    container.appendChild(renderer.domElement);

    cameraController = new CameraController(camera);

    addHandlers();
    addResources(function () {
        createWorld(startRendering);
    });
}

function setUpShadow(castShadow) {
    if (castShadow) {
        light.shadowDarkness = Const.SHADOW_DARKNESS;
        light.shadowCameraNear = Const.SHADOW_NEAR;
        light.shadowCameraFar = Const.SHADOW_FAR;

        light.shadowCameraLeft = -Const.SHADOW_CAMERA_SIZE;
        light.shadowCameraRight = Const.SHADOW_CAMERA_SIZE;
        light.shadowCameraTop = Const.SHADOW_CAMERA_SIZE;
        light.shadowCameraBottom = -Const.SHADOW_CAMERA_SIZE;

        light.shadowMapWidth = Const.SHADOW_MAP_SIZE;
        light.shadowMapHeight = Const.SHADOW_MAP_SIZE;

        //light.shadowCameraVisible = true;
    } else {
        light.position.copy(Const.LIGHT_SOURCE);
    }

    renderer.shadowMapEnabled = castShadow;
    light.castShadow = castShadow;
}

function createWorld(onComplete) {
    var opt = config.Computers["Green"];
    computer = new Computer(opt, resources, scene);

    subject = new Player(computer, 0, 640, 640, Const.DOWN);
    computer.addPlayer(subject);
    cameraController.subject = subject.lightCycle.models[4];

    onComplete();
}

function addHandlers() {
window.addEventListener('resize', onResize);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
}

function addResources(onComplete) {
    var info = {
        models: {},
        textures: {
            "textures/circuit.png": 0,
            "textures/grid.png": 0,
        }
    };
    resources = new Resources();
    resources.autoLoad(info, function () {}, onComplete);
}

function startRendering() {
    animate();
}

function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function onKeyDown(event) {
    switch (event.keyCode) {
    case 37: // Left arrow
    case 65: // A
        subject.turn(-1);
        event.preventDefault();
        break;

    case 39: // Right arrow
    case 68: // D
        subject.turn(1);
        event.preventDefault();
        break;

    case 67: // C
        cameraController.switchSubjectOffset();
        break;

    case 87: // W
        cameraController.switchOffset(1);
        break;

    case 81: // Q
        cameraController.switchRotation(1);
        break;

    case 69: // E
        cameraController.switchRotation(2);
        break;
    }
}

function onKeyUp(event) {
    switch (event.keyCode) {
    case 87: // W
        cameraController.switchOffset(0);
        break;

    case 81: // Q
        cameraController.cancelSwitchRotation(1);
        break;

    case 69: // E
        cameraController.cancelSwitchRotation(2);
        break;
    }
}

function animate() {
    requestAnimationFrame(animate);

    var delta = clock.getDelta();

    computer.tic(delta);
    cameraController.tic(delta);

    if (light.castShadow) {
        light.position.copy(cameraController.subject.position);
        light.position.add(Const.LIGHT_SOURCE);
        light.target.position.copy(cameraController.subject.position);
    }

    renderer.render(scene, camera);
}

function checkRequirements () {
    // Check for WebSocket support.
    if (!("WebSocket" in window)) {
        return  "Your browser doesn't support WebSockets.";
        return false;
    }

    // Checking for WebGL.
    var contexts = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
    var supported = false;

    for (var i = 0, len = contexts.length; i < len; i++) {
        try {
            var context = document.createElement("canvas").getContext(
                    contexts[i]);
            if (context) {
                supported = true;
                break;
            }
        } catch (error) {
        }
    }

    if (!supported) {
        return "Your browser doesn't support WebGL.";
    }

    return null;
}

function main() {
    var initialMessage = document.getElementsByClassName(
            "initialMessage")[0];
    var error = checkRequirements();
    if (error == null) {
        initialMessage.parentElement.removeChild(initialMessage);
    } else {
        initialMessage.textContent = error;
        return;
    }

    var container = document.createElement("div");
    container.setAttribute("class", "canvasContainer");
    document.body.appendChild(container);
    init(container);
}

main();
