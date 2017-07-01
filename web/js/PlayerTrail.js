function PlayerTrail(computer) {
    this.computer = computer;
    this.newTrails = [];
    this.startedX = 0;
    this.startedY = 0;
}

PlayerTrail.XOFF = [-1, -1, -1,  0,  0,  0,  1,  1,  1];
PlayerTrail.ZOFF = [-1,  0,  1, -1,  0,  1, -1,  0,  1];

PlayerTrail.prototype.startAt = function (xCell, yCell) {
    this.startedX = xCell;
    this.startedY = yCell;

    var x, z, mesh;
    var cs = Config.CELL_SIZE;
    var csh = cs / 2;
    var th = Const.TRAIL_HEIGHT / 2;
    var size = this.computer.size;
    var geo = new THREE.CubeGeometry(cs, 0.8, cs);
    var mat = new THREE.MeshPhongMaterial({
        map: this.computer.resources.getTexture(this.computer.opt.lightCycleTextures[0])
    });
    for (x = -1; x <= 1; x++) {
        for (z = -1; z <= 1; z++) {
            mesh = new THREE.Mesh(geo, mat);
            mesh.position.set(x*size + xCell*cs+csh, th, z*size + yCell*cs+csh);
            mesh.castShadow = true;
            this.computer.scene.add(mesh);
            this.newTrails.push(mesh);
        }
    }
};

PlayerTrail.prototype.modify = function (xCell, yCell, direction) {
    var trail, diff, pos, i;
    var size = this.computer.size;
    var cs = Config.CELL_SIZE;

    if (direction === Const.LEFT || direction === Const.RIGHT) {
        diff = Math.abs(xCell - this.startedX) + 1;
        pos = ((this.startedX + xCell + 1) / 2) * cs;

        for (i = 0; i < 9; i++) {
            trail = this.newTrails[i];
            trail.scale.x = diff;
            trail.position.x = PlayerTrail.XOFF[i]*size + pos;
        }
    } else {
        diff = Math.abs(yCell - this.startedY) + 1;
        pos = ((this.startedY + yCell + 1) / 2) * cs;

        for (i = 0; i < 9; i++) {
            trail = this.newTrails[i];
            trail.scale.z = diff;
            trail.position.z = PlayerTrail.ZOFF[i]*size + pos;
        }
    }

    // TODO: Delete this.
    if (this.startedX !== xCell && this.startedY != yCell) {
        throw "This is very bad.";
    }
};

PlayerTrail.prototype.endAt = function (xCell, yCell, direction) {
    if (direction === Const.RIGHT) {
        this.modify(xCell - 1, yCell, direction);
    } else if (direction === Const.DOWN) {
        this.modify(xCell, yCell - 1, direction);
    } else if (direction === Const.LEFT) {
        this.modify(xCell + 1, yCell, direction);
    } else if (direction === Const.UP) {
        this.modify(xCell, yCell + 1, direction);
    }

    this.newTrails = [];
};
