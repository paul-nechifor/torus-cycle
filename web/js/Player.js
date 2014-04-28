function Player(computer, id, xCell, yCell, direction) {
    this.computer = computer;
    this.id = id;
    this.lightCycle = new LightCycle(computer, xCell, yCell, direction);
    this.trail = new PlayerTrail(computer);
    this.trail.startAt(xCell, yCell);
}

Player.prototype.tic = function (delta) {
    this.lightCycle.tic(delta);
    var lc = this.lightCycle;
    if (lc.inNewCell) {
        this.trail.modify(lc.xCell, lc.yCell, lc.direction);
    }
};

Player.prototype.turn = function (way) {
    var lc = this.lightCycle;
    lc.moveToClosestCell();
    this.trail.endAt(lc.xCell, lc.yCell, lc.direction);
    lc.turn(way);
    this.trail.startAt(lc.xCell, lc.yCell);
};