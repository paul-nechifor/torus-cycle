function Resources() {
    this.textures = {};
    this.models = {};
}

Resources.prototype.autoLoad = function(info, onUpdate, onCompletion) {
    var loaded = 0;

    for (var path in info.textures) {
        this.loadTexture(path);
        loaded += info.textures[path];
        onUpdate(loaded / info.totalSize);
    }

    // Fix this.
//        var i = 0;
//        var paths = Object.keys(info.models);
//        var that = this;
//        var makeModel = function() {
//            loaded += info.models[paths[i]];
//            onUpdate(loaded / info.totalSize);
//
//            if (i < paths.length - 1) {
//                i++;
//                that.loadModel(paths[i], makeModel);
//            } else {
            onCompletion();
//            }
//        };
//        this.loadModel(paths[i], makeModel);
};

Resources.prototype.loadTexture = function(path) {
    this.textures[path] = THREE.ImageUtils.loadTexture(path);
};

Resources.prototype.getTexture = function(path) {
    if (!this.textures[path]) {
        this.loadTexture(path);
    }
    return this.textures[path];
};

Resources.prototype.loadModel = function(path, onCompletion) {
    var that = this;
    var comp = function(geometry) {
        that.models[path] = geometry;
        onCompletion();
    };

    var loader = new THREE.JSONLoader();
    loader.load(path, comp, "textures");
};

Resources.prototype.getModel = function(path) {
    return this.models[path];
};