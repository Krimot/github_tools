// ========== Background Dot Animation ==========
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const DOT_SPACING = 40;
const DOT_BASE_RADIUS = 2;

// Canvas size setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

// Initialize dots
function initDots() {
    dots = [];
    for (let y = -DOT_SPACING; y < canvas.height + DOT_SPACING; y += DOT_SPACING) {
        for (let x = -DOT_SPACING; x < canvas.width + DOT_SPACING; x += DOT_SPACING) {
            dots.push({
                baseX: x,
                baseY: y,
                baseZ: 0,
                currentX: x,
                currentY: y,
                currentZ: 0,
                targetZ: 0,
                phase: Math.random() * Math.PI * 2,
                speed: 0.5 + Math.random() * 0.5,
                phaseOffset: Math.random() * Math.PI * 2
            });
        }
    }
}

// Update dot positions based on mode
function updateDots() {
    const time = Date.now() * 0.001;

    dots.forEach(dot => {
        if (imageIsActive === false) {
            // Table mode: Grid formation with 3D wave effect
            // ほぼ位置は固定、Z軸で濃淡を表現
            const waveX = Math.sin(dot.baseX * 0.02 + time * 0.8) * Math.cos(dot.baseY * 0.02 + time * 0.6);
            const waveY = Math.cos(dot.baseX * 0.015 + time * 0.7) * Math.sin(dot.baseY * 0.015 + time * 0.5);

            dot.targetZ = (waveX + waveY) * 50 + 30;

            // わずかな位置の揺れ
            dot.currentX = dot.baseX + Math.sin(time * 0.3 + dot.phase) * 0.5;
            dot.currentY = dot.baseY + Math.cos(time * 0.3 + dot.phaseOffset) * 0.5;
        } else {
            // Size mode: 3D wave toward center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = dot.baseX - centerX;
            const dy = dot.baseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 中心からの距離に基づく波
            const wave = Math.sin(distance * 0.02 - time * 2) * 80;
            dot.targetZ = wave + 50;

            // 波に合わせてわずかに位置を動かす
            const angle = Math.atan2(dy, dx);
            const posWave = Math.sin(distance * 0.02 - time * 2) * 3;
            dot.currentX = dot.baseX + Math.cos(angle) * posWave;
            dot.currentY = dot.baseY + Math.sin(angle) * posWave;
        }

        // Smooth Z interpolation
        const ease = 0.08;
        dot.currentZ += (dot.targetZ - dot.currentZ) * ease;
    });
}

// Render dots with 3D effect
function renderDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dots.forEach(dot => {
        // パースペクティブ計算
        const perspective = 800;
        const scale = perspective / (perspective + dot.currentZ);

        // Z値に基づいてサイズと不透明度を変化
        const radius = DOT_BASE_RADIUS * (1 + dot.currentZ / 100);
        const opacity = Math.max(0.2, Math.min(1, (dot.currentZ + 50) / 150));

        ctx.beginPath();
        ctx.arc(dot.currentX, dot.currentY, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
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
