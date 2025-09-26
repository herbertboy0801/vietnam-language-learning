// 診斷cursor問題的腳本
// 請將此代碼複製到瀏覽器開發者工具的Console中執行

console.log('=== Cursor 診斷開始 ===');

// 1. 檢查所有按鈕元素
const buttons = document.querySelectorAll('button, .btn, select, .form-select, [onclick]');
console.log('找到', buttons.length, '個可點擊元素');

buttons.forEach((btn, index) => {
    const computedStyle = window.getComputedStyle(btn);
    const cursor = computedStyle.cursor;
    
    console.log(`元素 ${index + 1}:`, {
        tagName: btn.tagName,
        className: btn.className,
        cursor: cursor,
        text: btn.textContent.trim().substring(0, 20)
    });
    
    // 強制設置cursor
    btn.style.cursor = 'pointer';
    btn.style.setProperty('cursor', 'pointer', 'important');
});

// 2. 檢查CSS載入狀態
const styleSheets = Array.from(document.styleSheets);
console.log('載入的CSS文件數量:', styleSheets.length);

styleSheets.forEach((sheet, index) => {
    try {
        console.log(`CSS ${index + 1}:`, sheet.href || 'inline');
    } catch (e) {
        console.log(`CSS ${index + 1}: 無法訪問 (可能是跨域)`);
    }
});

// 3. 測試新增cursor規則
const style = document.createElement('style');
style.textContent = `
    * {
        cursor: default !important;
    }
    
    button,
    .btn,
    .btn-primary,
    .btn-secondary,
    .btn-outline-primary,
    .btn-outline-secondary,
    .btn-ghost,
    .btn-sm,
    select,
    .form-select,
    input[type="button"],
    input[type="submit"],
    [onclick],
    .nav-link,
    [role="button"] {
        cursor: pointer !important;
    }
`;
document.head.appendChild(style);

console.log('=== 診斷完成，已強制設置cursor樣式 ===');
console.log('請檢查按鈕是否現在顯示手形cursor');

// 4. 持續監控和重設
setInterval(() => {
    document.querySelectorAll('button, .btn, select, .form-select, [onclick]').forEach(btn => {
        if (window.getComputedStyle(btn).cursor !== 'pointer') {
            btn.style.setProperty('cursor', 'pointer', 'important');
        }
    });
}, 1000);

console.log('已設置持續監控，每秒檢查和修復cursor樣式');