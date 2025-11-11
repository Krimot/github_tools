// ========== Background Dot Animation ==========
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const DOT_SPACING = 15;
const DOT_BASE_RADIUS = 2;
const GRID_LINE_SPACING = 120; // 格子線の間隔

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

// 最も近い格子線からの距離を計算
function getDistanceToNearestGridLine(x, y) {
    const distToVerticalLine = Math.abs((x % GRID_LINE_SPACING) - GRID_LINE_SPACING / 2);
    const distToHorizontalLine = Math.abs((y % GRID_LINE_SPACING) - GRID_LINE_SPACING / 2);
    return Math.min(distToVerticalLine, distToHorizontalLine);
}

// Update dot positions based on mode
function updateDots() {
    const time = Date.now() * 0.001;

    dots.forEach(dot => {
        // 大きな揺れを追加（並びは維持）
        const bigWaveX = Math.sin(time * 0.4 + dot.phase) * 8;
        const bigWaveY = Math.cos(time * 0.35 + dot.phaseOffset) * 8;
        const secondaryWaveX = Math.sin(time * 0.6 + dot.phase * 1.5) * 5;
        const secondaryWaveY = Math.cos(time * 0.55 + dot.phaseOffset * 1.3) * 5;

        if (imageIsActive === false) {
            // Table mode: Grid formation with lines
            // 格子線からの距離を計算
            const distToLine = getDistanceToNearestGridLine(dot.baseX, dot.baseY);

            // 格子線に近いほど強く表示
            const lineStrength = 1 - Math.min(distToLine / 30, 1);

            // Z軸で格子線の強さを表現
            const baseZ = lineStrength * 80 + 20;

            // 波状の動き
            const waveX = Math.sin(dot.baseX * 0.02 + time * 0.8) * Math.cos(dot.baseY * 0.02 + time * 0.6);
            const waveY = Math.cos(dot.baseX * 0.015 + time * 0.7) * Math.sin(dot.baseY * 0.015 + time * 0.5);

            dot.targetZ = baseZ + (waveX + waveY) * 30;

            // 大きな揺れを適用（基本位置からの相対移動）
            dot.currentX = dot.baseX + bigWaveX + secondaryWaveX;
            dot.currentY = dot.baseY + bigWaveY + secondaryWaveY;
        } else {
            // Size mode: 3D wave toward center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = dot.baseX - centerX;
            const dy = dot.baseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 中心からの距離に基づく波
            const wave = Math.sin(distance * 0.02 - time * 2) * 100;
            dot.targetZ = wave + 60;

            // 波に合わせて大きく位置を動かす
            const angle = Math.atan2(dy, dx);
            const posWave = Math.sin(distance * 0.02 - time * 2) * 10;
            dot.currentX = dot.baseX + Math.cos(angle) * posWave + bigWaveX + secondaryWaveX;
            dot.currentY = dot.baseY + Math.sin(angle) * posWave + bigWaveY + secondaryWaveY;
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
        // Z値に基づいてサイズと不透明度を変化
        const radius = DOT_BASE_RADIUS * (1 + dot.currentZ / 80);
        const opacity = Math.max(0.1, Math.min(1, (dot.currentZ + 20) / 130));

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
