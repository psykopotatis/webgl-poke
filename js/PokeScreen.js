var PokeScreen = Class.extend({
    init: function(scene) {
        this.scene = scene;
        this.MAX_POKE = 649;
        this.pokeX = -100;
        this.pokeY = 100;

        this.stars = starField({
            scene: this.scene,
            stars: 35000,
            size:3
        });

        this.getRandomPoke();
    },

    getRandomPoke: function() {
        var that = this;
        var randomPokeId = Math.round(Math.random() * this.MAX_POKE);

        $.get('http://d33lqiidgt9m13.cloudfront.net/static/js/poke/' + randomPokeId + '.json', function(data) {
            that.pixels = data.pixels;
            that.drawPoke();
        });
    },

    drawPoke: function() {
        for (var x=0; x < 96; x++) {
            for (var y=0; y < 96; y++) {
                var color = this.pixels[x][y];
                if (color !== 0) {
                    var position = {x:this.pokeX + (x * POKE_TILE_SIZE), y:this.pokeY - (y * POKE_TILE_SIZE)};
                    var hex = parseInt(color.replace('#', ''), 16);
                    this.drawPixel(position, hex);
                }
            }
        }
    },

    drawPixel: function(position, color) {
        var geometry = new THREE.CubeGeometry(POKE_TILE_SIZE, POKE_TILE_SIZE, Math.random() * POKE_TILE_SIZE + 2);
        var material = new THREE.MeshLambertMaterial({color: color});
        var pixel = new THREE.Mesh(geometry, material);
        pixel.position.x = position.x;
        pixel.position.y = position.y;
        this.scene.add(pixel);
    },

    update: function() {
        this.stars.update();
    }
});