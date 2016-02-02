POKE_TILE_SIZE = 2;

var Poke = Class.extend({
    init: function() {
        this.WIDTH = window.innerWidth - 5;
        this.HEIGHT = window.innerHeight - 5;

        this.createStats();

        this.createRenderer();
        this.createScene();
        this.createCamera();
        this.createLights();
        this.createGrid();

        this.registerMouseListeners();

        this.screen = new PokeScreen(this.scene);
        this.updateCameraInfo();

        var self = this;
        requestAnimationFrame(function(){
            self.update();
            self.render();
        });
    },

    createStats: function() {
        this.stats = new Stats();
        this.stats.domElement.style.position	= 'absolute';
        this.stats.domElement.style.top = '0px';
        this.stats.domElement.style.right = '5px';
        document.body.appendChild(this.stats.domElement);
    },

    createScene: function() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2( 0x000000, 0.0011);
    },

    createRenderer: function() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true	// to get smoother output?
        });
        this.renderer.setSize(this.WIDTH, this.HEIGHT);
        $('#container').append(this.renderer.domElement);
    },

    createCamera: function() {
        this.VIEW_ANGLE = 45;
        this.ASPECT = this.WIDTH / this.HEIGHT;
        this.NEAR = 0.1;
        this.FAR = 10000;
        this.CAMERA_POSITION = 200;
        this.TILE_SIZE = 4;

        this.camera =
            new THREE.PerspectiveCamera(
                this.VIEW_ANGLE,
                this.ASPECT,
                this.NEAR,
                this.FAR);

        // the camera starts at 0,0,0 so pull it back
        this.camera.position.x = -30;
        this.camera.position.y = -30;
        this.camera.position.z = this.CAMERA_POSITION;
        this.camera.lookAt(this.scene.position);  // Look at scene bit from side
        this.scene.add(this.camera);
    },

    createLights: function() {
        var pointLight = new THREE.PointLight(0xFFFFFF);
        pointLight.name = "save-me";
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;
        this.scene.add(pointLight);

        var randomLight1 = new THREE.DirectionalLight(Math.random() * 0xffffff);
        randomLight1.name = "randomLight1";
        randomLight1.position.set(Math.random(), Math.random(), Math.random()).normalize();
        this.scene.add(randomLight1);

        var randomLight2 = new THREE.DirectionalLight(Math.random() * 0xffffff);
        randomLight2.name = "randomLight2";
        randomLight2.position.set(Math.random(), Math.random(), Math.random()).normalize();
        this.scene.add(randomLight2);
    },

    createGrid: function() {
        // Height is 2 x since (0, 0) is in the middle of the screen
        var DISPLAY_HEIGHT = 2 * this.CAMERA_POSITION * Math.tan(this.VIEW_ANGLE / 2 * (Math.PI / 180));
        var DISPLAY_WIDTH = DISPLAY_HEIGHT * (this.WIDTH / this.HEIGHT);

        var X_MAX = DISPLAY_WIDTH / 2;
        var X_MIN = 0 - (DISPLAY_WIDTH / 2);
        var Y_MAX = DISPLAY_HEIGHT / 2;
        var Y_MIN = 0 - (DISPLAY_HEIGHT / 2);

        // Draw a partial white grid
        var gridMaterial = new THREE.LineBasicMaterial({
            color: 0xffffff,
            opacity: 0.2
        });

        var grid = new THREE.Object3D();
        grid.name = "pokeGrid";

        // Horizontal lines
        var x_geometry = new THREE.Geometry();
        x_geometry.vertices.push(new THREE.Vector3(X_MIN, 0, 0));
        x_geometry.vertices.push(new THREE.Vector3(X_MAX, 0, 0));
        for (var y=2; y<Y_MAX; y=y+this.TILE_SIZE) {
            var xLine = new THREE.Line(x_geometry, gridMaterial);
            xLine.position.y = y;
            grid.add(xLine);
        }

        // Vertical lines
        var y_geometry = new THREE.Geometry();
        y_geometry.vertices.push(new THREE.Vector3(0, Y_MAX, 0));
        y_geometry.vertices.push(new THREE.Vector3(0, Y_MIN, 0));
        for (var x=2; x<X_MAX; x=x+this.TILE_SIZE) {
            var yLine = new THREE.Line(y_geometry, gridMaterial);
            yLine.position.x = x;
            grid.add(yLine);
        }

        this.scene.add(grid);
    },

    registerMouseListeners: function() {
        this.mouseX;
        this.mouseY;
        this.mouseWheel = 0;
        this.updateCameraPosition = false;
        this.updateCameraZoom = false;

        var $canvas = $('canvas');

        var that = this;

        $canvas.mousemove(function() {
            that.mouseX = event.clientX - (that.WIDTH / 2);
            that.mouseY = event.clientY - (that.HEIGHT / 2);
        });

        $canvas.mousedown(function() {
            document.body.style.cursor = "move";
            that.updateCameraPosition = true;
        });

        $canvas.mouseup(function() {
            document.body.style.cursor = "default";
            that.updateCameraPosition = false;
        });

        $canvas.mousewheel(function(objEvent, intDelta){
            that.updateCameraZoom = true;
            that.mouseWheel += intDelta;
        });
    },

    update: function() {
        var self = this;
        requestAnimationFrame(function(){
            self.update();
            self.render();
        });

        this.screen.update();
        this.updateCamera();
        this.stats.update();
    },

    updateCamera: function() {
        if (this.updateCameraPosition) {
            this.camera.position.x += (this.mouseX - this.camera.position.x) * 0.01;
            this.camera.position.y += (- this.mouseY - this.camera.position.y) * 0.01;
            this.camera.lookAt(this.scene.position);
            this.updateCameraInfo();
        }

        if (this.updateCameraZoom) {
            this.camera.position.z = this.CAMERA_POSITION + this.mouseWheel;
            this.updateCameraInfo();
        }
    },

    updateCameraInfo: function() {
        $('#info').html('Move camera with mouse, zoom with mouse wheel.<br/>Camera position: (' + this.camera.position.x.toFixed(2) + ', ' + this.camera.position.y.toFixed(2) + ')<br/>Zoom: ' + this.camera.position.z.toFixed(2));
    },

    render: function() {
        this.renderer.render(this.scene, this.camera);
    }
});

$(document).ready(function() {
    if (Detector.webgl) {
        new Poke();
    } else {
        Detector.addGetWebGLMessage();
    }
});
