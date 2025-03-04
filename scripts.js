// 初始化粒子系统
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationFrame;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 生成新粒子
    if (particles.length < 100) {
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        ));
    }

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.size <= 0.2) {
            particles.splice(index, 1);
        }
    });

    animationFrame = requestAnimationFrame(animateParticles);
}
animateParticles();

// 主题切换功能
function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
}

// 生成随机数核心功能
function generateNumbers() {
    const min = parseInt(document.getElementById('min').value) || 1;
    const max = parseInt(document.getElementById('max').value) || 9;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;

    if (validateInput(min, max, quantity)) {
        const results = Array.from({ length: quantity }, () => 
            Math.floor(Math.random() * (max - min + 1)) + min
        );
        showResult(results);
        createParticleBurst();
    }
}

function validateInput(min, max, quantity) {
    if (min >= max) {
        alert("最大值必须大于最小值");
        return false;
    }
    if (quantity < 1 || quantity > 1000) {
        alert("生成数量需在1-1000之间");
        return false;
    }
    return true;
}

// 结果展示功能
function showResult(numbers) {
    const modal = document.getElementById('resultModal');
    const output = document.getElementById('resultOutput');
    output.textContent = numbers.join(', ');
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// 分享功能
function shareResult() {
    const result = document.getElementById('resultOutput').textContent;
    const shareData = {
        title: '量子随机数生成结果',
        text: `🎲随机数结果：${result}`,
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareData.text);
        alert('结果已复制到剪贴板');
    }
}

// 粒子爆发效果
function createParticleBurst() {
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle(
            canvas.width / 2,
            canvas.height / 2
        ));
    }
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// 点击外部关闭弹窗
document.addEventListener('click', (event) => {
    const modal = document.getElementById('resultModal');
    if (event.target === modal) {
        closeModal();
    }
});

// 初始化
document.addEventListener('DOMContentLoaded', initTheme);
