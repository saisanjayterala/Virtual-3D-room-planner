// Initialize Three.js scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('room-container').appendChild(renderer.domElement);

// Add a simple cube to represent a room
const geometry = new THREE.BoxGeometry(5, 3, 5);
const material = new THREE.MeshBasicMaterial({color: 0xcccccc, side: THREE.BackSide});
const room = new THREE.Mesh(geometry, material);
scene.add(room);

camera.position.z = 5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Basic controls
document.getElementById('add-furniture').addEventListener('click', () => {
    // TODO: Implement furniture addition
    console.log('Add furniture clicked');
});

document.getElementById('change-wall-color').addEventListener('click', () => {
    // TODO: Implement wall color change
    console.log('Change wall color clicked');
});