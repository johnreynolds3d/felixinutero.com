var camera, glScene, glRenderer;
var cssScene, cssRenderer;
var controls;
var input;
var mesh;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 10);

    controls = new THREE.TrackballControls(camera);

    glScene = new THREE.Scene();

    // glScene.background = new THREE.CubeTextureLoader()
    //     .setPath('images/cube/MilkyWay/')
    //     .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
    // glScene.background.format = THREE.RGBFormat;

    var geometry = new THREE.SphereGeometry(500, 60, 40);
    var material = new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load('images/sphere/CrabNebula.jpg')
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(-1, 1, 1); // important step!
    glScene.add(mesh);

    cssScene = new THREE.Scene();

    // Any mesh using this material will act as a see-thru to the css renderer
    var material = new THREE.MeshBasicMaterial();
    material.color.set('black');
    material.opacity = 0;
    material.blending = THREE.NoBlending;

    // Create the DOM element
    var element1 = document.querySelector(".content-one canvas");

    // Create the CSS3DObject for this element
    var cssObject1 = new THREE.CSS3DObject(element1);
    cssObject1.position.set(0, 4.5, 0);
    cssObject1.scale.set(0.01, 0.01, 1);
    cssScene.add(cssObject1);

    // Create the plane mesh
    var planeMesh1 = new THREE.Mesh(new THREE.PlaneGeometry(), material);
    planeMesh1.position.copy(cssObject1.position);
    planeMesh1.scale.copy(cssObject1.scale);
    glScene.add(planeMesh1);

    // Create the DOM element
    var element2 = document.querySelector(".content-two canvas");

    // Create the CSS3DObject for this element
    var cssObject2 = new THREE.CSS3DObject(element2);
    cssObject2.position.y = '-4.5';
    cssObject2.scale.copy(planeMesh1.scale);
    cssScene.add(cssObject2);

    //Create the plane mesh
    var planeMesh2 = new THREE.Mesh(new THREE.PlaneGeometry(), material);
    planeMesh2.position.copy(cssObject2.position);
    planeMesh2.scale.copy(cssObject2.scale);
    glScene.add(planeMesh2);

    cssRenderer = new THREE.CSS3DRenderer();
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.domElement.style.position = 'absolute';
    cssRenderer.domElement.style.top = 0;
    document.body.appendChild(cssRenderer.domElement);

    glRenderer = new THREE.WebGLRenderer();
    glRenderer.setPixelRatio(window.devicePixelRatio);
    glRenderer.setSize(window.innerWidth, window.innerHeight);
    // glRenderer.vr.enabled = true;
    document.body.appendChild(glRenderer.domElement);
    // document.body.appendChild(WEBVR.createButton(glRenderer));

    var renderer3 = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector(".content-one canvas")
    });

    var camera3 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10);

    var scene3 = new THREE.Scene();
    scene3.background = new THREE.Color(0x505050);

    var room = new THREE.Mesh(
        new THREE.BoxGeometry(6, 6, 6, 8, 8, 8),
        new THREE.MeshBasicMaterial({
            color: 0x808080,
            wireframe: true
        })
    );
    scene3.add(new THREE.HemisphereLight(0x606060, 0x404040));

    var light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1).normalize();
    scene3.add(light);

    scene3.add(room);

    var objects = [];
    for (var i = 0; i < 64; i++) {

        var object = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.15), new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        }));

        object.position.x = Math.random() * 4 - 2;
        object.position.y = Math.random() * 4 - 2;
        object.position.z = Math.random() * 4 - 2;

        object.rotation.x = Math.random() * 2 * Math.PI;
        object.rotation.y = Math.random() * 2 * Math.PI;
        object.rotation.z = Math.random() * 2 * Math.PI;

        object.scale.x = Math.random() + 0.5;
        object.scale.y = Math.random() + 0.5;
        object.scale.z = Math.random() + 0.5;

        object.userData.velocity = new THREE.Vector3();
        object.userData.velocity.x = Math.random() * 0.01 - 0.005;
        object.userData.velocity.y = Math.random() * 0.01 - 0.005;
        object.userData.velocity.z = Math.random() * 0.01 - 0.005;

        object.castShadow = true;
        object.receiveShadow = true;
        object.material.transparent = true;

        scene3.add(object);
        objects.push(object);
    }

    function resizeCanvasToDisplaySize3(force) {
        var canvas = renderer3.domElement;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        if (force || canvas.width !== width || canvas.height !== height) {

            // you must pass false here or three.js sadly fights the browser
            renderer3.setSize(width, height, false);
            camera3.aspect = width / height;
            camera3.updateProjectionMatrix();
        }
    }

    function animate3(time) {
        resizeCanvasToDisplaySize3();

        camera3.rotation.x += 0.0004;
        camera3.rotation.y += -0.0004;

        var clock = new THREE.Clock();
        var delta = clock.getDelta() * 60;

        // Keep cubes inside room
        for (var i = 0; i < objects.length; i++) {

            var cube = objects[i];
            cube.position.add(cube.userData.velocity);

            if (cube.position.x < -3 || cube.position.x > 3) {
                cube.position.x = THREE.Math.clamp(cube.position.x, -3, 3);
                cube.userData.velocity.x = -cube.userData.velocity.x;
            }

            if (cube.position.y < -3 || cube.position.y > 3) {
                cube.position.y = THREE.Math.clamp(cube.position.y, -3, 3);
                cube.userData.velocity.y = -cube.userData.velocity.y;
            }

            if (cube.position.z < -3 || cube.position.z > 3) {
                cube.position.z = THREE.Math.clamp(cube.position.z, -3, 3);
                cube.userData.velocity.z = -cube.userData.velocity.z;
            }

            cube.rotation.x += cube.userData.velocity.x * 2 * delta;
            cube.rotation.y += cube.userData.velocity.y * 2 * delta;
            cube.rotation.z += cube.userData.velocity.z * 2 * delta;

            cube.rotation.x += 0.001;
            cube.rotation.y += 0.001;
            cube.rotation.z += 0.001;
        }

        renderer3.render(scene3, camera3);
        requestAnimationFrame(animate3);
    }
    resizeCanvasToDisplaySize3(true);
    requestAnimationFrame(animate3);

    var renderer2 = new THREE.WebGLRenderer({
        antialias: true,
        canvas: document.querySelector(".content-two canvas")
    });

    // There's no reason to set the aspect here because we're going to set it every frame anyhow
    var camera2 = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10);

    var scene2 = new THREE.Scene();
    scene2.background = new THREE.CubeTextureLoader()
        .setPath('images/cube/winter/')
        .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

    function resizeCanvasToDisplaySize2(force) {
        var canvas = renderer2.domElement;
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;
        if (force || canvas.width !== width || canvas.height !== height) {

            // you must pass false here or three.js sadly fights the browser
            renderer2.setSize(width, height, false);
            camera2.aspect = width / height;
            camera2.updateProjectionMatrix();

            // set render target sizes here
        }
    }

    function animate2(time) {

        resizeCanvasToDisplaySize2();

        camera2.rotation.y += 0.0005;

        renderer2.render(scene2, camera2);
        requestAnimationFrame(animate2);
    }
    resizeCanvasToDisplaySize2(true);
    requestAnimationFrame(animate2);

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    mesh.rotation.x += 0.0005;
    mesh.rotation.y += -0.0005;

    glRenderer.render(glScene, camera);
    cssRenderer.render(cssScene, camera);
}