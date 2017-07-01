function CameraController(camera) {
    this.camera = camera;

    this.offsetIndex = 0;
    this.rotIndex = 0;

    this.distance = new GoalPost(Const.DISTANCES[this.offsetIndex]);
    this.angle = new GoalPost(Const.ANGLES[this.offsetIndex] * Math.PI/180);
    this.rotation = new GoalPost(Const.ROTATIONS[this.rotIndex] * Math.PI/180);

    this.subject = null;
    this.subjectDistIndex = 0;
    this.subjectDist = Const.SUBJECT_DISTANCES[this.subjectDistIndex];
    this.subjectAngle = -Math.PI/2;
    this.subjectLookAt = new THREE.Vector3();
}

CameraController.prototype.tic = function (delta) {
    if (this.distance.changing) {
        this.distance.useIncrement(delta * Const.DISTANCE_SPEED);
    }

    if (this.angle.changing) {
        this.angle.useIncrement(delta * Const.ANGLE_SPEED);
    }

    if (this.rotation.changing) {
        this.rotation.useIncrement(delta * Const.ROTATION_SPEED);
    }

    this.subjectLookAt.copy(this.subject.position);
    var offsetRotation = this.subjectAngle - this.subject.rotation.y;
    this.subjectLookAt.x += this.subjectDist * Math.cos(offsetRotation);
    this.subjectLookAt.z += this.subjectDist * Math.sin(offsetRotation);

    this.camera.position.copy(this.subjectLookAt);
    this.camera.position.y += this.distance.value * Math.cos(this.angle.value);
    var onZ = this.distance.value * Math.sin(this.angle.value);
    var rotation = this.rotation.value - this.subject.rotation.y;
    this.camera.position.x += onZ * Math.cos(rotation);
    this.camera.position.z += onZ * Math.sin(rotation);
    this.camera.lookAt(this.subjectLookAt);
};

CameraController.prototype.switchSubjectOffset = function () {
    this.subjectDistIndex++;
    this.subjectDistIndex %= Const.SUBJECT_DISTANCES.length;
    this.subjectDist = Const.SUBJECT_DISTANCES[this.subjectDistIndex];
};

CameraController.prototype.switchOffset = function (index) {
    this.offsetIndex = index;
    this.distance.setGoal(Const.DISTANCES[this.offsetIndex]);
    this.angle.setGoal(Const.ANGLES[this.offsetIndex] * Math.PI/180);
};

CameraController.prototype.switchRotation = function (index) {
    this.rotIndex = index;
    this.rotation.setGoal(Const.ROTATIONS[this.rotIndex] * Math.PI/180);
};

CameraController.prototype.cancelSwitchRotation = function (index) {
    if (index === this.rotIndex) {
        this.switchRotation(0);
    }
};
