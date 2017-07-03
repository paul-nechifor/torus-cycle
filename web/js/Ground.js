import config from './config';

export default function Ground(opt, resources) {
    this.object = new THREE.Object3D();
    this.loadObjects(opt, resources);
}

Ground.prototype.loadObjects = function (opt, resources) {
    var size = opt.cells * config.CELL_SIZE;

    var tex = resources.getTexture(opt.circuitTexture);
    tex.repeat.set(4, 4);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    var geo = new THREE.PlaneGeometry(size, size);
    var mat = new THREE.MeshLambertMaterial({map: tex});
    var mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.position.set(size/2, -2, size/2);
    mesh.receiveShadow = true;
    this.object.add(mesh);

    tex = resources.getTexture(opt.gridTexture);
    tex.repeat.set(16, 16);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    geo = new THREE.PlaneGeometry(size, size);
    mat = new THREE.MeshLambertMaterial({
        map: tex,
        transparent: true,
        opacity: 0.5
    });
    mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = - Math.PI * 0.5;
    mesh.position.set(size/2, 0, size/2);
    this.object.add(mesh);
};
