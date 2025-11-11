// ========== Background Dot Animation ==========
const canvas = document.getElementById('dotCanvas');
const ctx = canvas.getContext('2d');
let dots = [];
const DOT_SPACING = 15;
const DOT_BASE_RADIUS = 1.5;
const DOT_MAX_RADIUS = 4;
const GRID_LINE_SPACING = 120; // 格子線の間隔

// Canvas size setup
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initDots();
}

// 最も近い格子線からの距離を計算
function getDistanceToNearestGridLine(x, y) {
    const distToVerticalLine = Math.abs((x % GRID_LINE_SPACING) - GRID_LINE_SPACING / 2);
    const distToHorizontalLine = Math.abs((y % GRID_LINE_SPACING) - GRID_LINE_SPACING / 2);
    return Math.min(distToVerticalLine, distToHorizontalLine);
}

// 距離に基づいて表示確率を計算
function getShouldDisplay(distance) {
    // 格子線から30px以内：100%表示
    // 30-60px：確率的に表示
    // 60px以上：まばらに表示
    if (distance < 30) {
        return true;
    } else if (distance < 45) {
        return Math.random() > 0.3; // 70%の確率で表示
    } else if (distance < 60) {
        return Math.random() > 0.7; // 30%の確率で表示
    } else {
        return Math.random() > 0.85; // 15%の確率で表示
    }
}

// Initialize dots
function initDots() {
    dots = [];
    for (let y = -DOT_SPACING; y < canvas.height + DOT_SPACING; y += DOT_SPACING) {
        for (let x = -DOT_SPACING; x < canvas.width + DOT_SPACING; x += DOT_SPACING) {
            const distToLine = getDistanceToNearestGridLine(x, y);

            // 格子線からの距離に基づいて表示するかどうかを決定
            if (getShouldDisplay(distToLine)) {
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
            // Table mode: Grid formation with density
            // 波状の動き
            const waveX = Math.sin(dot.baseX * 0.02 + time * 0.8) * Math.cos(dot.baseY * 0.02 + time * 0.6);
            const waveY = Math.cos(dot.baseX * 0.015 + time * 0.7) * Math.sin(dot.baseY * 0.015 + time * 0.5);

            dot.targetZ = (waveX + waveY) * 50 + 40;

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
        const zFactor = (dot.currentZ + 40) / 180; // 0～1の範囲に正規化
        const radius = DOT_BASE_RADIUS + (DOT_MAX_RADIUS - DOT_BASE_RADIUS) * Math.max(0, Math.min(1, zFactor));

        // 不透明度：最小0.3、最大1.0
        const opacity = Math.max(0.3, Math.min(1, 0.3 + zFactor * 0.7));

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
