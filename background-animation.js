// ========== Background Dot Animation ==========
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const DOT_SPACING = 15;
const DOT_BASE_RADIUS = 1.5;
const DOT_MAX_RADIUS = 3;
const GRID_LINE_SPACING = 150; // 格子線の間隔

// Canvas size setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

// 最も近い格子線の位置を計算
function getNearestGridLinePosition(x, y) {
    const nearestVerticalLine = Math.round(x / GRID_LINE_SPACING) * GRID_LINE_SPACING;
    const nearestHorizontalLine = Math.round(y / GRID_LINE_SPACING) * GRID_LINE_SPACING;

    const distToVertical = Math.abs(x - nearestVerticalLine);
    const distToHorizontal = Math.abs(y - nearestHorizontalLine);

    // より近い格子線を選択
    if (distToVertical < distToHorizontal) {
        return { x: nearestVerticalLine, y: y, isVertical: true };
    } else {
        return { x: x, y: nearestHorizontalLine, isVertical: false };
    }
}

// Initialize dots
function initDots() {
    dots = [];
    for (let y = -DOT_SPACING; y < canvas.height + DOT_SPACING; y += DOT_SPACING) {
        for (let x = -DOT_SPACING; x < canvas.width + DOT_SPACING; x += DOT_SPACING) {
            dots.push({
                baseX: x,
                baseY: y,
                targetX: x,
                targetY: y,
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
        // 大きな揺れを追加
        const bigWaveX = Math.sin(time * 0.4 + dot.phase) * 8;
        const bigWaveY = Math.cos(time * 0.35 + dot.phaseOffset) * 8;
        const secondaryWaveX = Math.sin(time * 0.6 + dot.phase * 1.5) * 5;
        const secondaryWaveY = Math.cos(time * 0.55 + dot.phaseOffset * 1.3) * 5;

        if (imageIsActive === false) {
            // Table mode: Move dots toward grid lines
            const gridPos = getNearestGridLinePosition(dot.baseX, dot.baseY);

            // 格子線に向かって移動（完全には到達しない）
            const moveToGridX = (gridPos.x - dot.baseX) * 0.6;
            const moveToGridY = (gridPos.y - dot.baseY) * 0.6;

            // 波状の動き
            const waveX = Math.sin(dot.baseX * 0.02 + time * 0.8) * Math.cos(dot.baseY * 0.02 + time * 0.6);
            const waveY = Math.cos(dot.baseX * 0.015 + time * 0.7) * Math.sin(dot.baseY * 0.015 + time * 0.5);

            dot.targetZ = (waveX + waveY) * 40 + 40;

            // 格子線への移動 + 揺れ
            dot.targetX = dot.baseX + moveToGridX + bigWaveX + secondaryWaveX;
            dot.targetY = dot.baseY + moveToGridY + bigWaveY + secondaryWaveY;
        } else {
            // Size mode: 3D wave toward center
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            const dx = dot.baseX - centerX;
            const dy = dot.baseY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 中心からの距離に基づく波（中心に向かう）
            const wave = Math.sin(distance * 0.02 + time * 2) * 100;
            dot.targetZ = wave + 60;

            // 波に合わせて位置を動かす
            const angle = Math.atan2(dy, dx);
            const posWave = Math.sin(distance * 0.02 + time * 2) * 10;

            dot.targetX = dot.baseX + Math.cos(angle) * posWave + bigWaveX + secondaryWaveX;
            dot.targetY = dot.baseY + Math.sin(angle) * posWave + bigWaveY + secondaryWaveY;
        }

        // Smooth interpolation（ゆるやかな移動）
        const ease = 0.05;
        dot.currentX += (dot.targetX - dot.currentX) * ease;
        dot.currentY += (dot.targetY - dot.currentY) * ease;
        dot.currentZ += (dot.targetZ - dot.currentZ) * ease;
    });
}

// Render dots with 3D effect
function renderDots() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

    // 全てのドットを表示
    dots.forEach(dot => {
        // Z値に基づいてサイズと不透明度をわずかに変化
        const zFactor = (dot.currentZ + 40) / 180;
        const radius = DOT_BASE_RADIUS + (DOT_MAX_RADIUS - DOT_BASE_RADIUS) * Math.max(0, Math.min(1, zFactor)) * 0.5;

        // 画面中心からの距離に基づいて暗くする
        const dx = dot.currentX - centerX;
        const dy = dot.currentY - centerY;
        const distanceFromCenter = Math.sqrt(dx * dx + dy * dy);
        const edgeFade = 1 - Math.pow(distanceFromCenter / maxDistance, 2) * 0.7; // 周囲を最大70%暗く

        let opacity = Math.max(0.6, Math.min(1, 0.6 + zFactor * 0.4));
        opacity *= edgeFade; // 周囲のフェード効果を適用

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
