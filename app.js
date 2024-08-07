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

// Wall colors
const wallColors = {
    front: 0xcccccc,
    back: 0xcccccc,
    left: 0xcccccc,
    right: 0xcccccc,
    top: 0xcccccc,
    bottom: 0xcccccc
};

// Create room
function createRoom() {
    const roomGeometry = new THREE.BoxGeometry(roomWidth, roomHeight, roomDepth);
    const roomMaterials = [
        new THREE.MeshBasicMaterial({color: wallColors.right, side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({color: wallColors.left, side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({color: wallColors.top, side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({color: wallColors.bottom, side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({color: wallColors.front, side: THREE.BackSide}),
        new THREE.MeshBasicMaterial({color: wallColors.back, side: THREE.BackSide})
    ];
    return new THREE.Mesh(roomGeometry, roomMaterials);
}

let room = createRoom();
scene.add(room);

camera.position.set(0, roomHeight / 2, roomDepth / 2 + 5);
camera.lookAt(0, roomHeight / 2, 0);

// Orbit controls for camera
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Furniture array
const furniture = [];

// Function to create furniture
function createFurniture(type) {
    let geometry, material, mesh;
    const color = Math.random() * 0xffffff;

    switch (type) {
        case 'chair':
            // Create chair base
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            material = new THREE.MeshBasicMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);

            // Create chair back
            const backGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.1);
            const backMesh = new THREE.Mesh(backGeometry, material);
            backMesh.position.set(0, 0.6, -0.2);
            mesh.add(backMesh);
            break;

        case 'table':
            // Create table top
            geometry = new THREE.BoxGeometry(1.5, 0.1, 1);
            material = new THREE.MeshBasicMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);

            // Create table legs
            const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
            const legMaterial = new THREE.MeshBasicMaterial({color: color});
            for (let i = 0; i < 4; i++) {
                const leg = new THREE.Mesh(legGeometry, legMaterial);
                leg.position.set(
                    i < 2 ? -0.6 : 0.6,
                    -0.4,
                    i % 2 === 0 ? 0.4 : -0.4
                );
                mesh.add(leg);
            }
            break;

        case 'bed':
            // Create bed base
            geometry = new THREE.BoxGeometry(2, 0.3, 1.5);
            material = new THREE.MeshBasicMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);

            // Create bed headboard
            const headboardGeometry = new THREE.BoxGeometry(2, 0.8, 0.1);
            const headboardMesh = new THREE.Mesh(headboardGeometry, material);
            headboardMesh.position.set(0, 0.55, -0.7);
            mesh.add(headboardMesh);
            break;

        case 'sofa':
            // Create sofa base
            geometry = new THREE.BoxGeometry(2, 0.5, 1);
            material = new THREE.MeshBasicMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);

            // Create sofa back
            const sofaBackGeometry = new THREE.BoxGeometry(2, 0.7, 0.3);
            const sofaBackMesh = new THREE.Mesh(sofaBackGeometry, material);
            sofaBackMesh.position.set(0, 0.6, -0.35);
            mesh.add(sofaBackMesh);

            // Create sofa arms
            const armGeometry = new THREE.BoxGeometry(0.3, 0.7, 1);
            const leftArm = new THREE.Mesh(armGeometry, material);
            leftArm.position.set(-0.85, 0.1, 0);
            mesh.add(leftArm);
            const rightArm = new THREE.Mesh(armGeometry, material);
            rightArm.position.set(0.85, 0.1, 0);
            mesh.add(rightArm);
            break;

        case 'bookshelf':
            // Create bookshelf base
            geometry = new THREE.BoxGeometry(1.5, 2, 0.4);
            material = new THREE.MeshBasicMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);

            // Create shelves
            const shelfGeometry = new THREE.BoxGeometry(1.4, 0.05, 0.38);
            for (let i = 1; i < 5; i++) {
                const shelf = new THREE.Mesh(shelfGeometry, material);
                shelf.position.set(0, -1 + i * 0.5, 0);
                mesh.add(shelf);
            }
            break;

        default:
            geometry = new THREE.BoxGeometry(1, 1, 1);
            material = new THREE.MeshBasicMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);
    }

    return mesh;
}

// Function to add furniture
function addFurniture(type) {
    const furniture = createFurniture(type);
    
    // Random position within the room
    furniture.position.set(
        (Math.random() - 0.5) * (roomWidth - 2),
        furniture.geometry.parameters.height / 2,
        (Math.random() - 0.5) * (roomDepth - 2)
    );
    
    scene.add(furniture);
    furniture.push(furniture);
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
            new THREE.Vector3(-roomWidth/2 + 1, item.position.y, -roomDepth/2 + 1),
            new THREE.Vector3(roomWidth/2 - 1, item.position.y, roomDepth/2 - 1)
        );
    });
}

// Function to update wall colors
function updateWallColors() {
    room.material[0].color.setHex(wallColors.right);
    room.material[1].color.setHex(wallColors.left);
    room.material[2].color.setHex(wallColors.top);
    room.material[3].color.setHex(wallColors.bottom);
    room.material[4].color.setHex(wallColors.front);
    room.material[5].color.setHex(wallColors.back);
}

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    stats.update();
}
animate();

// Event listeners
document.getElementById('add-furniture').addEventListener('click', () => {
    const furnitureType = document.getElementById('furniture-type').value;
    addFurniture(furnitureType);
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

// Wall color event listeners
['front', 'back', 'left', 'right', 'top', 'bottom'].forEach(wall => {
    document.getElementById(`${wall}-color`).addEventListener('input', (e) => {
        wallColors[wall] = parseInt(e.target.value.substring(1), 16);
        updateWallColors();
    });
});

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});