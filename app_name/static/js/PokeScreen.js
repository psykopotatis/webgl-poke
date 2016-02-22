var PokeScreen = Class.extend({
    init: function(scene) {
        this.scene = scene;
        this.MAX_POKE = 649;
        this.pokeX = -100;
        this.pokeY = 100;
        this.pokePixels = [];
        this.exploding = false;

        this.stars = starField({
            scene: this.scene,
            stars: 35000,
            size:3
        });

        this.getRandomPoke();

        var that = this;

        $('#boom a').click(function() {
            that.createExplosion();
        })
    },

    getRandomPoke: function() {
        var that = this;
        var randomPokeId = Math.round(Math.random() * this.MAX_POKE);

        $.get('/static/js/poke/' + randomPokeId + '.json', function(data) {
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
        // Save each pixel, so we can explode it later
        this.pokePixels.push(pixel);
    },


    createExplosion: function() {
        if (this.exploding) {
            return;
        }

        var length = this.pokePixels.length;

        for (var i=0; i<length; i++) {
            var pixel = this.pokePixels[i];
            pixel.vx = Math.random() * 0.5 * (Math.random() > 0.5 ? -1 : 1);
            // pixel.vy = Math.random() * 1.2 * (Math.random() > 0.5 ? -1 : 1);
            pixel.vz = Math.random() * 3 * (Math.random() > 0.5 ? -1 : 1);
        }

        this.exploding = true;
    },

    update: function() {
        this.stars.update();
        this.updateExplosion();
    },

    updateExplosion: function() {
        if (! this.exploding) {
            return;
        }

        var length = this.pokePixels.length;

        for (var i=0; i<length; i++) {
            var pixel = this.pokePixels[i];
            pixel.position.x += pixel.vx;
            // pixel.position.y += pixel.vy;
            pixel.position.z += pixel.vz;
            pixel.rotation.x += 0.03;
        }
    }
});