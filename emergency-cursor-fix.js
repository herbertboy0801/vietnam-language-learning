// 緊急修復cursor問題 - 請複製此代碼到瀏覽器Console執行

console.log('=== 緊急修復cursor問題 ===');

// 1. 創建最高優先級的CSS樣式
const emergencyStyle = document.createElement('style');
emergencyStyle.id = 'emergency-cursor-fix';
emergencyStyle.textContent = `
    /* 使用最高優先級選擇器 */
    html body * button,
    html body * .btn,
    html body * .btn-primary,
    html body * .btn-secondary,
    html body * .btn-outline-primary,
    html body * .btn-outline-secondary,
    html body * .btn-ghost,
    html body * .btn-sm,
    html body * select,
    html body * .form-select,
    html body * input[type="button"],
    html body * input[type="submit"],
    html body * [onclick] {
        cursor: pointer !important;
        pointer-events: auto !important;
    }
    
    /* 針對特定區域 */
    .quiz-buttons button,
    .quiz-buttons .btn,
    .toolbar-group button,
    .toolbar-group .btn,
    .card-controls button,
    .card-controls .btn {
        cursor: pointer !important;
    }
`;

// 移除已存在的樣式
const existing = document.getElementById('emergency-cursor-fix');
if (existing) existing.remove();

// 添加新樣式到頭部
document.head.appendChild(emergencyStyle);

// 2. 直接修改每個按鈕元素的樣式
const buttons = document.querySelectorAll('button, .btn, select, .form-select, [onclick]');
console.log('找到', buttons.length, '個可點擊元素');

buttons.forEach((btn, index) => {
    // 清除可能的conflicting樣式
    btn.style.removeProperty('cursor');
    
    // 設置cursor
    btn.style.cursor = 'pointer';
    btn.style.setProperty('cursor', 'pointer', 'important');
    
    // 直接在style屬性中添加
    const currentStyle = btn.getAttribute('style') || '';
    if (!currentStyle.includes('cursor: pointer')) {
        btn.setAttribute('style', currentStyle + '; cursor: pointer !important;');
    }
    
    // 添加事件監聽器來維持cursor樣式
    btn.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
    
    // 檢查結果
    const computed = window.getComputedStyle(btn);
    console.log(`按鈕 ${index + 1}:`, {
        text: btn.textContent.trim().substring(0, 15),
        cursor: computed.cursor,
        classList: btn.className
    });
});

// 3. 設置持續監控
let monitorInterval = setInterval(() => {
    document.querySelectorAll('button, .btn, select, .form-select, [onclick]').forEach(btn => {
        if (window.getComputedStyle(btn).cursor !== 'pointer') {
            btn.style.setProperty('cursor', 'pointer', 'important');
        }
    });
}, 500);

// 4. 監控DOM變化
const observer = new MutationObserver(() => {
    setTimeout(() => {
        document.querySelectorAll('button, .btn, select, .form-select, [onclick]').forEach(btn => {
            btn.style.setProperty('cursor', 'pointer', 'important');
        });
    }, 100);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log('=== 緊急修復完成 ===');
console.log('如果仍然沒有手形cursor，請檢查瀏覽器設置或嘗試其他瀏覽器');

// 5. 測試特定按鈕
setTimeout(() => {
    const testButtons = [
        document.querySelector('.btn-outline-primary'),
        document.querySelector('.btn-primary'),
        document.querySelector('select')
    ].filter(btn => btn);
    
    console.log('=== 測試特定按鈕 ===');
    testButtons.forEach((btn, index) => {
        const computed = window.getComputedStyle(btn);
        console.log(`測試按鈕 ${index + 1}:`, {
            element: btn,
            computedCursor: computed.cursor,
            styleCursor: btn.style.cursor,
            hasOnclick: btn.hasAttribute('onclick') || btn.onclick !== null
        });
    });
}, 1000);