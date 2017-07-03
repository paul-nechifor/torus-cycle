import config from './config';
import {changesSign} from './utils';
import Const from './Const';

export default function LightCycle(computer, xCell, yCell, direction) {
    this.computer = computer;
    this.direction = direction;
    this.leftToTurn = 0.0;
    this.models = [];
    this.setUpModels(xCell, yCell);
    this.xCell = xCell;
    this.yCell = yCell;
    this.inNewCell = true;
}

LightCycle.prototype.setUpModels = function (xCell, yCell) {
    var model;
    var x = xCell * config.CELL_SIZE + config.CELL_SIZE/2;
    var z = yCell * config.CELL_SIZE + config.CELL_SIZE/2;

    for (var i = 0; i < 9; i++) {
        model = LightCycle.loadNewModel(this.computer);
        model.position.x = x;
        model.position.z = z;
        model.rotation.y = - this.direction * Math.PI/2;
        this.models.push(model);
        this.computer.grounds[i].object.add(model);
    }
};

LightCycle.prototype.remove = function () {
    for (var i = 0; i < 9; i++) {
        this.computer.grounds[i].object.remove(this.models[i]);
    }
};

LightCycle.prototype.moveToClosestCell = function () {
    var cellSize = config.CELL_SIZE;
    var pos = this.models[0].position;
    this.xCell = Math.floor(pos.x / cellSize);
    this.yCell = Math.floor(pos.z / cellSize);
    var x = (this.xCell + 0.5) * cellSize;
    var z = (this.yCell + 0.5) * cellSize;

    for (var i = 0; i < 9; i++) {
        pos = this.models[i].position;
        pos.x = x;
        pos.z = z;
    }
};

/**
 * Left or right (-1 or 1).
 */
LightCycle.prototype.turn = function (way) {
    this.direction = (this.direction + way + 4) % 4;
    this.leftToTurn -= way * Math.PI/2;
};

LightCycle.prototype.tic = function (delta) {
    var increment, pos, roty, x, z, i;
    var size = this.computer.size;

    increment = config.MOVE_SPEED * delta;
    pos = this.models[0].position;
    x = pos.x;
    z = pos.z;

    // Calculating new position.
    if (this.direction === Const.RIGHT) {
        x = (x + increment + size) % size;
    } else if (this.direction === Const.DOWN) {
        z = (z + increment + size) % size;
    } else if (this.direction === Const.LEFT) {
        x = (x - increment + size) % size;
    } else if (this.direction === Const.UP) {
        z = (z - increment + size) % size;
    }

    // Setting the position for all the models.
    for (i = 0; i < 9; i++) {
        pos = this.models[i].position;
        pos.x = x;
        pos.z = z;
    }

    // Checking if this is a new cell.
    var cellSize = config.CELL_SIZE;
    var xCell = Math.floor(x / cellSize);
    var yCell = Math.floor(z / cellSize);
    if (xCell !== this.xCell || yCell !== this.yCell) {
        this.xCell = xCell;
        this.yCell = yCell;
        this.inNewCell = true;
    } else {
        this.inNewCell = false;
    }

    // Checking if the rotation needs to change.
    if (this.leftToTurn !== 0.0) {
        increment = delta * Const.TURN_SPEED;
        if (this.leftToTurn < 0) {
            increment = -increment;
        }

        roty = this.models[0].rotation.y;
        if (changesSign(this.leftToTurn, increment)) {
            roty += this.leftToTurn;
            this.leftToTurn = 0.0;
        } else {
            roty += increment;
            this.leftToTurn -= increment;
        }

        // Setting the new rotation for all the models.
        for (i = 0; i < 9; i++) {
            this.models[i].rotation.y = roty;
        }
    }
};

LightCycle.loadNewModel = function (comp) {
    var object = new THREE.Object3D();

    var geo = new THREE.CubeGeometry(2.5, 1, 0.5);
    var mat = new THREE.MeshPhongMaterial({
        map: comp.resources.getTexture(comp.opt.lightCycleTextures[0])
    });
    var mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    object.add(mesh);

    geo = new THREE.SphereGeometry(0.6, 16, 16);
    mesh = new THREE.Mesh(geo, mat);
    mesh.position.x += 0.75;
    mesh.position.y += 0.3;
    mesh.castShadow = true;
    object.add(mesh);

    geo = new THREE.SphereGeometry(0.7, 16, 16);
    mesh = new THREE.Mesh(geo, mat);
    mesh.position.x -= 0.75;
    mesh.position.y += 0.35;
    mesh.castShadow = true;
    object.add(mesh);

    return object;
};
