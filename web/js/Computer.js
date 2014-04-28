/**
 * A computer is a game world.
 */
function Computer(opt, resources, scene) {
    this.opt = opt;
    this.resources = resources;
    this.scene = scene;
    this.size = opt.cells * Config.CELL_SIZE;
    this.grounds = [];
    this.players = {};
    this.setUp();
}

Computer.prototype.setUp = function () {
    var x, z, ground;
    for (x = -1; x <= 1; x++) {
        for (z = -1; z <= 1; z++) {
            ground = new Ground(this.opt, this.resources);
            ground.object.position.x = x * this.size;
            ground.object.position.z = z * this.size;
            this.grounds.push(ground);
            this.scene.add(ground.object);
        }
    }
};
    
Computer.prototype.addPlayer = function (player) {
    this.players[player.id] = player;
};
    
Computer.prototype.removePlayer = function (player) {
    delete this.players[player.id];
};
    
Computer.prototype.tic = function (delta) {
    for (var id in this.players) {
        this.players[id].tic(delta);
    }
};