// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('room-container').appendChild(renderer.domElement);

// Room dimensions
let roomWidth = 10;
let roomHeight = 5;
let roomDepth = 10;

// Create room
function createRoom() {
    const roomGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth);
    const roomMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.BackSide});
    return new THREE.Mesh(roomGeometry, roomMaterial);
}

let room = createRoom();
scene.add(room);

camera.position.set(0, roomHeight / 2, roomDepth / 2 + 5);
camera.lookAt(0, roomHeight / 2, 0);

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
        (Math.random() - 0.5) * (roomWidth - 1),
        0.5,
        (Math.random() - 0.5) * (roomDepth - 1)
    );
    
    scene.add(mesh);
    furniture.push(mesh);
}

// Function to update room dimensions
function updateRoomDimensions() {
    scene.remove(room);
    room = createRoom();
    scene.add(room);
    
    // Update camera position
    camera.position.set(0, roomHeight / 2, roomDepth / 2 + 5);
    camera.lookAt(0, roomHeight / 2, 0);
    
    // Update furniture positions
    furniture.forEach(item => {
        item.position.clamp(
            new THREE.Vector3(-roomWidth/2 + 0.5, 0.5, -roomDepth/2 + 0.5),
            new THREE.Vector3(roomWidth/2 - 0.5, roomHeight - 0.5, roomDepth/2 - 0.5)
        );
    });
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

document.getElementById('room-width').addEventListener('input', (e) => {
    roomWidth = parseInt(e.target.value);
    document.getElementById('width-value').textContent = roomWidth;
    updateRoomDimensions();
});

document.getElementById('room-height').addEventListener('input', (e) => {
    roomHeight = parseInt(e.target.value);
    document.getElementById('height-value').textContent = roomHeight;
    updateRoomDimensions();
});

document.getElementById('room-depth').addEventListener('input', (e) => {
    roomDepth = parseInt(e.target.value);
    document.getElementById('depth-value').textContent = roomDepth;
    updateRoomDimensions();
});

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});