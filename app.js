// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xf0f0f0);
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
    const roomMaterials = Object.values(wallColors).map(color => 
        new THREE.MeshPhongMaterial({color: color, side: THREE.BackSide})
    );
    return new THREE.Mesh(roomGeometry, roomMaterials);
}

let room = createRoom();
scene.add(room);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.8);
pointLight.position.set(0, roomHeight - 1, 0);
scene.add(pointLight);

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
            geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            material = new THREE.MeshPhongMaterial({color: color});
            mesh = new THREE.Group();
            const seat = new THREE.Mesh(geometry, material);
            mesh.add(seat);
            const backGeometry = new THREE.BoxGeometry(0.5, 0.7, 0.1);
            const backMesh = new THREE.Mesh(backGeometry, material);
            backMesh.position.set(0, 0.6, -0.2);
            mesh.add(backMesh);
            break;
        case 'table':
            geometry = new THREE.BoxGeometry(1.5, 0.1, 1);
            material = new THREE.MeshPhongMaterial({color: color});
            mesh = new THREE.Group();
            const top = new THREE.Mesh(geometry, material);
            mesh.add(top);
            const legGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.7);
            const legMaterial = new THREE.MeshPhongMaterial({color: color});
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
            material = new THREE.MeshPhongMaterial({color: color});
            mesh = new THREE.Mesh(geometry, material);
    }

    mesh.userData.type = type;
    return mesh;
}

// Function to add furniture with animation
function addFurniture(type) {
    const item = createFurniture(type);
    
    item.position.set(
        (Math.random() - 0.5) * (roomWidth - 2),
        roomHeight,
        (Math.random() - 0.5) * (roomDepth - 2)
    );
    
    scene.add(item);
    furniture.push(item);

    // Animation: Drop furniture from the ceiling
    new TWEEN.Tween(item.position)
        .to({ y: item.geometry ? item.geometry.parameters.height / 2 : 0.5 }, 1000)
        .easing(TWEEN.Easing.Bounce.Out)
        .start();
}

// Function to update room dimensions
function updateRoomDimensions() {
    scene.remove(room);
    room = createRoom();
    scene.add(room);
    
    camera.position.set(0, roomHeight / 2, roomDepth / 2 + 5);
    camera.lookAt(0, roomHeight / 2, 0);
    
    pointLight.position.set(0, roomHeight - 1, 0);
    
    furniture.forEach(item => {
        item.position.clamp(
            new THREE.Vector3(-roomWidth/2 + 1, item.position.y, -roomDepth/2 + 1),
            new THREE.Vector3(roomWidth/2 - 1, item.position.y, roomDepth/2 - 1)
        );
    });
}

// Function to update wall colors
function updateWallColors() {
    if (room.material) {
        if (Array.isArray(room.material)) {
            room.material.forEach((mat, index) => {
                const wallName = ['right', 'left', 'top', 'bottom', 'front', 'back'][index];
                mat.color.setHex(wallColors[wallName]);
            });
        } else {
            room.material.color.setHex(wallColors.front);
        }
    }
}

// Stats
const stats = new Stats();
document.body.appendChild(stats.dom);

// Animation loop
function animate(time) {
    requestAnimationFrame(animate);
    TWEEN.update(time);
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
    const colorInput = document.getElementById(`${wall}-color`);
    if (colorInput) {
        colorInput.addEventListener('input', (e) => {
            wallColors[wall] = parseInt(e.target.value.substring(1), 16);
            updateWallColors();
        });
    }
});

// Window resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Save room layout
document.getElementById('save-layout').addEventListener('click', () => {
    const layout = {
        roomDimensions: { width: roomWidth, height: roomHeight, depth: roomDepth },
        wallColors: wallColors,
        furniture: furniture.map(item => ({
            type: item.userData.type,
            position: item.position.toArray(),
            rotation: item.rotation.toArray()
        }))
    };
    try {
        localStorage.setItem('roomLayout', JSON.stringify(layout));
        alert('Room layout saved!');
    } catch (error) {
        console.error('Error saving room layout:', error);
        alert('Failed to save room layout. Please try again.');
    }
});

// Load room layout
document.getElementById('load-layout').addEventListener('click', () => {
    try {
        const savedLayout = localStorage.getItem('roomLayout');
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            roomWidth = layout.roomDimensions.width;
            roomHeight = layout.roomDimensions.height;
            roomDepth = layout.roomDimensions.depth;
            wallColors = layout.wallColors;
            updateRoomDimensions();
            updateWallColors();
            
            // Clear existing furniture
            furniture.forEach(item => scene.remove(item));
            furniture.length = 0;
            
            // Add saved furniture with animation
            layout.furniture.forEach(item => {
                const newItem = createFurniture(item.type);
                newItem.position.fromArray(item.position);
                newItem.rotation.fromArray(item.rotation);
                scene.add(newItem);
                furniture.push(newItem);

                // Animation: Scale up the loaded furniture
                newItem.scale.set(0.1, 0.1, 0.1);
                new TWEEN.Tween(newItem.scale)
                    .to({ x: 1, y: 1, z: 1 }, 1000)
                    .easing(TWEEN.Easing.Elastic.Out)
                    .start();
            });
            
            alert('Room layout loaded!');
        } else {
            alert('No saved layout found!');
        }
    } catch (error) {
        console.error('Error loading room layout:', error);
        alert('Failed to load room layout. Please try again.');
    }
});

// Toggle grid
let grid;
document.getElementById('toggle-grid').addEventListener('click', () => {
    if (grid) {
        scene.remove(grid);
        grid = null;
    } else {
        const gridHelper = new THREE.GridHelper(Math.max(roomWidth, roomDepth), 10);
        gridHelper.position.y = 0.01; // Slightly above the floor
        scene.add(gridHelper);
        grid = gridHelper;
    }
});

// Rotate furniture
document.getElementById('rotate-furniture').addEventListener('click', () => {
    const selectedFurniture = furniture.find(item => item.userData.selected);
    if (selectedFurniture) {
        new TWEEN.Tween(selectedFurniture.rotation)
            .to({ y: selectedFurniture.rotation.y + Math.PI / 2 }, 500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
    } else {
        alert('Please select a furniture item to rotate.');
    }
});

// Delete furniture
document.getElementById('delete-furniture').addEventListener('click', () => {
    const selectedIndex = furniture.findIndex(item => item.userData.selected);
    if (selectedIndex !== -1) {
        const selectedFurniture = furniture[selectedIndex];
        new TWEEN.Tween(selectedFurniture.scale)
            .to({ x: 0.1, y: 0.1, z: 0.1 }, 500)
            .easing(TWEEN.Easing.Back.In)
            .onComplete(() => {
                scene.remove(selectedFurniture);
                furniture.splice(selectedIndex, 1);
            })
            .start();
    } else {
        alert('Please select a furniture item to delete.');
    }
});

// Raycaster for selecting furniture
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

renderer.domElement.addEventListener('click', onMouseClick, false);

function onMouseClick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(furniture, true);

    furniture.forEach(item => {
        item.traverse(child => {
            if (child.isMesh) {
                child.material.emissive.setHex(0x000000);
            }
        });
        item.userData.selected = false;
    });

    if (intersects.length > 0) {
        let selectedItem = intersects[0].object;
        while (selectedItem.parent && !furniture.includes(selectedItem)) {
            selectedItem = selectedItem.parent;
        }
        if (furniture.includes(selectedItem)) {
            selectedItem.userData.selected = true;
            selectedItem.traverse(child => {
                if (child.isMesh) {
                    child.material.emissive.setHex(0x555555);
                }
            });
        }
    }
}