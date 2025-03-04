// 初始化量子随机数API
const QRNG_API = 'https://qrng.anu.edu.au/API/jsonI.php?length=100&type=uint8';

// 主题切换
function toggleTheme() {
    document.body.setAttribute('data-theme', 
        document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
}

// 生成随机数（模拟量子API调用）
async function generateNumbers() {
    const min = parseInt(document.getElementById('min').value) || 1;
    const max = parseInt(document.getElementById('max').value) || 9;
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    
    if (min >= max) {
        alert('最大值必须大于最小值');
        return;
    }

    if (quantity > 100 || quantity < 1) {
        alert('生成数量必须在1-100之间');
        return;
    }

    try {
        const response = await fetch(QRNG_API);
        const data = await response.json();
        const quantumNumbers = data.data;
        
        const results = [];
        for (let i = 0; i < quantity; i++) {
            const range = max - min + 1;
            const random = (quantumNumbers[i] % range) + min;
            results.push(random);
        }

        showResults(results);
    } catch (error) {
        // 如果API失效，使用备用方案
        const results = Array.from({length: quantity}, () => 
            Math.floor(Math.random() * (max - min + 1)) + min);
        showResults(results);
    }
}

// 显示结果弹窗
function showResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = results.map(num => 
        `<span class="neon-number">${num}</span>`
    ).join('');
    
    const modal = document.getElementById('resultModal');
    modal.style.display = 'flex';
}

// 关闭弹窗
function closeModal() {
    document.getElementById('resultModal').style.display = 'none';
}

// 点击外部关闭弹窗
window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    if (event.target === modal) {
        closeModal();
    }
}

// 手机端优化：防止键盘弹出导致布局错乱
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('focus', () => {
        window.scrollTo(0, 0);
        document.body.style.height = '100vh';
    });
});
