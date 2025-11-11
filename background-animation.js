// ========== Background Dot Animation ==========
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const DOT_SPACING = 8;
const DOT_RADIUS = 1;
const DOT_COLOR = 'rgba(100, 100, 100, 0.3)';

// Canvas size setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

// Initialize dots
function initDots() {
    dots = [];
    for (let y = 0; y < canvas.height + DOT_SPACING; y += DOT_SPACING) {
        for (let x = 0; x < canvas.width + DOT_SPACING; x += DOT_SPACING) {
            dots.push({
                x: x,
                y: y,
                baseX: x,
                baseY: y,
                targetX: x,
                targetY: y,
                currentX: x,
                currentY: y,
                phase: Math.random() * Math.PI * 2,
                speed: 0.02 + Math.random() * 0.01
            });
        }
    }
}

// Update dot positions based on mode
function updateDots() {
    const time = Date.now() * 0.001;

    dots.forEach(dot => {
        // Base gentle movement
        const gentleX = Math.sin(time * dot.speed + dot.phase) * 1.5;
        const gentleY = Math.cos(time * dot.speed + dot.phase * 1.3) * 1.5;

        if (imageIsActive === false) {
            // Table mode: Grid formation with intensity variation
            const gridOffsetX = Math.sin(dot.baseY * 0.1 + time * 0.5) * 2;
            const gridOffsetY = Math.cos(dot.baseX * 0.1 + time * 0.5) * 2;
            const intensity = (Math.sin(dot.baseX * 0.05 + time * 0.3) + Math.cos(dot.baseY * 0.05 + time * 0.4)) * 0.5;

            dot.targetX = dot.baseX + gridOffsetX + intensity * 3;
            dot.targetY = dot.baseY + gridOffsetY + intensity * 3;
        } else {
            // Size mode: Wave toward center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = dot.baseX - centerX;
            const dy = dot.baseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const waveOffset = Math.sin(distance * 0.05 - time * 2) * 5;
            const angle = Math.atan2(dy, dx);

            dot.targetX = dot.baseX + Math.cos(angle) * waveOffset;
            dot.targetY = dot.baseY + Math.sin(angle) * waveOffset;
        }

        // Add gentle movement
        dot.targetX += gentleX;
        dot.targetY += gentleY;

        // Smooth interpolation
        const ease = 0.05;
        dot.currentX += (dot.targetX - dot.currentX) * ease;
        dot.currentY += (dot.targetY - dot.currentY) * ease;
    });
}

// Render dots
function renderDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => {
        ctx.beginPath();
        ctx.arc(dot.currentX, dot.currentY, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = DOT_COLOR;
        ctx.fill();
    });
}

// Animation loop
function animate() {
    updateDots();
    renderDots();
    requestAnimationFrame(animate);
}

// Initialize
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
animate();
