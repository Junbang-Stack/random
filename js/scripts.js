// 初始化设置
let currentTheme = localStorage.getItem('theme') || 'light';
let fireworks = [];
const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');

// Canvas初始化
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// 烟花粒子类
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.7) * 8;
        this.alpha = 1;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

// 烟花动画循环
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.alpha <= 0) {
            fireworks.splice(index, 1);
        }
    });
    
    requestAnimationFrame(animate);
}

// 创建烟花效果
function createFirework(x, y) {
    for (let i = 0; i < 50; i++) {
        fireworks.push(new Particle(x, y));
    }
}

// 主题切换
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// 生成随机数
function generateNumbers() {
    const min = parseInt(document.getElementById('min').value);
    const max = parseInt(document.getElementById('max').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (!validateInput(min, max, quantity)) return;

    createFirework(canvas.width / 2, canvas.height / 2);
    const results = Array.from({ length: quantity }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
    
    showModal(results);
    updateHistory(results);
}

// 显示弹窗
function showModal(results) {
    const modal = document.getElementById('resultModal');
    document.getElementById('result').textContent = results.join(', ');
    modal.style.display = 'block';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// 初始化事件监听
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    animate();
    document.documentElement.setAttribute('data-theme', currentTheme);
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // 设置经典模式默认值
    document.querySelector('.preset-btn.active').click();
});

// 点击外部关闭弹窗
window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
