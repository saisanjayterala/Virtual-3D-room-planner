// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('room-container').appendChild(renderer.domElement);

// Add a simple cube to represent a room
const roomGeometry = new THREE.BoxGeometry(10, 5, 10);
const roomMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.BackSide});
const room = new THREE.Mesh(roomGeometry, roomMaterial);
scene.add(room);

camera.position.set(0, 2.5, 7);
camera.lookAt(0, 0, 0);

// Orbit controls for camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Furniture array
const furniture = [];

// Function to add furniture
function addFurniture(type) {
    let geometry;
    switch (type) {
        case 'cube':
            geometry = new THREE.BoxGeometry(1, 1, 1);
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(0.5, 32, 32);
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
            break;
        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
    }
    
    const material = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff});
    const mesh = new THREE.Mesh(geometry, material);
    
    // Random position within the room
    mesh.position.set(
        (Math.random() - 0.5) * 8,
        0.5,
        (Math.random() - 0.5) * 8
    );
    
    scene.add(mesh);
    furniture.push(mesh);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Event listeners
document.getElementById('add-furniture').addEventListener('click', () => {
    const furnitureType = document.getElementById('furniture-type').value;
    addFurniture(furnitureType);
});

document.getElementById('change-wall-color').addEventListener('click', () => {
    room.material.color.setHex(Math.random() * 0xffffff);
});

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});