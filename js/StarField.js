/*
 * Creates random placed, rotating color-changing particles.
 */
var starField = function(options) {
    var that = {};
    var scene = options.scene;
    var stars = options.stars;
    var size = options.size;

    var geometry = new THREE.Geometry();

    for (i=0; i<stars; i++) {
        var vertex = new THREE.Vector3();
        vertex.x = Math.random() * 1000 - 500;
        vertex.y = Math.random() * 1000 - 500;
        vertex.z = Math.random() * 1000 - 500;
        geometry.vertices.push(vertex);
    }

    var material = new THREE.ParticleBasicMaterial({
        color: '0xffffff',
        map: THREE.ImageUtils.loadTexture(
                '/images/star.png'
                ),
        depthTest:false,
        blending: THREE.AdditiveBlending,
        transparent: 1,
        opacity: 1,
        size:size
    });
    material.color.setHSV(Math.random(), 1, 1);

    var particles = new THREE.ParticleSystem(geometry, material);
    particles.rotation.x = Math.random() * 15;
    particles.rotation.y = Math.random() * 15;
    particles.rotation.z = Math.random() * 15;

    scene.add(particles);

    /*
     * Update
     */
    that.update = function() {
        var time = Date.now() * 0.00001;
        particles.rotation.y = Date.now() * 0.00005;
        material.color.setHSV(time % 1, 1, 1);
    };

    return that;
};