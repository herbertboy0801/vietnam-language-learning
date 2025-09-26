// 內容管理類別
class ContentManager {
    constructor() {
        this.tempData = null;
    }

    // 批量匯入單字
    importVocabulary(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const words = [];

        for (let i = 1; i < lines.length; i++) {
            // 處理含有引號的 CSV 行
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 4) {
                words.push({
                    vietnamese: this.cleanText(values[0]) || '',
                    chinese: this.cleanText(values[1]) || '',
                    pronunciation: this.cleanText(values[2]) || '',
                    example: this.cleanText(values[3]) || '',
                    learned: false
                });
            }
        }

        return words;
    }

    // 解析 CSV 行（處理引號和逗號）
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }

    // 清理文字（移除多餘的引號和空白）
    cleanText(text) {
        return text.replace(/^["']|["']$/g, '').trim();
    }

    // 批量匯入句子
    importSentences(csvText) {
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        const sentences = [];

        for (let i = 1; i < lines.length; i++) {
            // 處理含有引號的 CSV 行
            const values = this.parseCSVLine(lines[i]);
            if (values.length >= 4) {
                sentences.push({
                    vietnamese: this.cleanText(values[0]) || '',
                    chinese: this.cleanText(values[1]) || '',
                    pronunciation: this.cleanText(values[2]) || '',
                    situation: this.cleanText(values[3]) || '',
                    learned: false
                });
            }
        }

        return sentences;
    }

    // 批量匯入文法
    importGrammar(jsonText) {
        try {
            const grammarData = JSON.parse(jsonText);
            return grammarData;
        } catch (error) {
            console.error('文法資料格式錯誤:', error);
            return null;
        }
    }

    // 從Excel/CSV格式轉換
    convertFromExcel(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                let text = e.target.result;
                
                // 移除 BOM 標記（如果存在）
                if (text.charCodeAt(0) === 0xFEFF) {
                    text = text.substr(1);
                }
                
                resolve(text);
            };
            reader.onerror = () => reject('檔案讀取失敗');
            
            // 首先嘗試以 UTF-8 讀取
            reader.readAsText(file, 'UTF-8');
        });
    }

    // 生成範本檔案
    generateVocabularyTemplate() {
        const template = `越南語,中文,發音,例句
xin chào,你好,sin chao,"Xin chào bạn! (你好！)"
cảm ơn,謝謝,kam ən,"Cảm ơn bạn rất nhiều! (非常感謝你！)"
xin lỗi,對不起,sin loi,"Xin lỗi, tôi không hiểu. (對不起，我不懂。)"`;
        
        // 添加 BOM 標記以確保 UTF-8 編碼正確顯示
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'vocabulary_template.csv';
        link.click();
        
        // 清理 URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
    }

    generateSentenceTemplate() {
        const template = `越南語,中文,發音,情境
"Bạn có khỏe không?",你好嗎？,ban ko kwe khong,問候
"Tôi rất vui được gặp bạn",很高興見到你,toi zət vui duək gap ban,初次見面
"Bạn tên là gì?",你叫什麼名字？,ban ten la zi,自我介紹`;
        
        // 添加 BOM 標記以確保 UTF-8 編碼正確顯示
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + template], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'sentence_template.csv';
        link.click();
        
        // 清理 URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
    }

    generateGrammarTemplate() {
        const template = {
            topics: [
                {
                    name: "基本句型",
                    rules: [
                        {
                            title: "越南語語序",
                            explanation: "越南語的基本語序是「主語 + 動詞 + 賓語」(SVO)",
                            examples: [
                                {
                                    vietnamese: "Tôi ăn cơm",
                                    chinese: "我吃飯",
                                    breakdown: "我(Tôi) + 吃(ăn) + 飯(cơm)"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        
        // 添加 BOM 標記以確保 UTF-8 編碼正確顯示
        const BOM = '\uFEFF';
        const jsonString = JSON.stringify(template, null, 2);
        const blob = new Blob([BOM + jsonString], { type: 'application/json;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'grammar_template.json';
        link.click();
        
        // 清理 URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
    }

    // 預覽匯入內容
    previewImportData(data, type) {
        const previewContainer = document.getElementById('importPreview');
        let html = '<h5>預覽匯入內容：</h5>';

        if (type === 'vocabulary') {
            html += '<div class="table-responsive"><table class="table table-sm">';
            html += '<thead><tr><th>越南語</th><th>中文</th><th>發音</th><th>例句</th></tr></thead><tbody>';
            data.slice(0, 5).forEach(word => {
                html += `<tr><td>${word.vietnamese}</td><td>${word.chinese}</td><td>${word.pronunciation}</td><td>${word.example}</td></tr>`;
            });
            if (data.length > 5) {
                html += `<tr><td colspan="4" class="text-muted">... 還有 ${data.length - 5} 個單字</td></tr>`;
            }
            html += '</tbody></table></div>';
        } else if (type === 'sentences') {
            html += '<div class="table-responsive"><table class="table table-sm">';
            html += '<thead><tr><th>越南語</th><th>中文</th><th>發音</th><th>情境</th></tr></thead><tbody>';
            data.slice(0, 5).forEach(sentence => {
                html += `<tr><td>${sentence.vietnamese}</td><td>${sentence.chinese}</td><td>${sentence.pronunciation}</td><td>${sentence.situation}</td></tr>`;
            });
            if (data.length > 5) {
                html += `<tr><td colspan="4" class="text-muted">... 還有 ${data.length - 5} 個句子</td></tr>`;
            }
            html += '</tbody></table></div>';
        }

        html += `<div class="mt-3">
            <button class="btn btn-success" onclick="contentManager.confirmImport('${type}')">確認匯入</button>
            <button class="btn btn-secondary" onclick="contentManager.cancelImport()">取消</button>
        </div>`;

        previewContainer.innerHTML = html;
    }

    // 確認匯入
    confirmImport(type) {
        if (!this.tempData) return;

        if (type === 'vocabulary') {
            // 詢問要加入哪個分類
            const categoryName = prompt('請輸入分類名稱（或選擇現有分類）:');
            if (categoryName) {
                let categoryIndex = vocabularyData.categories.findIndex(cat => cat.name === categoryName);
                if (categoryIndex === -1) {
                    // 創建新分類
                    vocabularyData.categories.push({
                        name: categoryName,
                        words: [...this.tempData]
                    });
                } else {
                    // 加入現有分類
                    vocabularyData.categories[categoryIndex].words.push(...this.tempData);
                }
                alert(`成功匯入 ${this.tempData.length} 個單字到「${categoryName}」分類！`);
            }
        } else if (type === 'sentences') {
            const categoryName = prompt('請輸入分類名稱（或選擇現有分類）:');
            if (categoryName) {
                let categoryIndex = sentenceData.categories.findIndex(cat => cat.name === categoryName);
                if (categoryIndex === -1) {
                    sentenceData.categories.push({
                        name: categoryName,
                        sentences: [...this.tempData]
                    });
                } else {
                    sentenceData.categories[categoryIndex].sentences.push(...this.tempData);
                }
                alert(`成功匯入 ${this.tempData.length} 個句子到「${categoryName}」分類！`);
            }
        }

        this.tempData = null;
        document.getElementById('importPreview').innerHTML = '';
        
        // 重新載入當前頁面以顯示新內容
        if (app.currentPage === 'vocabulary') {
            app.loadVocabularyPage();
        } else if (app.currentPage === 'sentences') {
            app.loadSentencesPage();
        }
    }

    // 取消匯入
    cancelImport() {
        this.tempData = null;
        document.getElementById('importPreview').innerHTML = '';
    }

    // 匯出現有內容為模板格式
    exportVocabularyAsCSV(categoryIndex) {
        const category = vocabularyData.categories[categoryIndex];
        let csv = '越南語,中文,發音,例句\n';
        
        category.words.forEach(word => {
            csv += `"${word.vietnamese}","${word.chinese}","${word.pronunciation}","${word.example}"\n`;
        });

        // 添加 BOM 標記以確保 UTF-8 編碼正確顯示
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${category.name}_vocabulary.csv`;
        link.click();
        
        // 清理 URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
    }

    exportSentencesAsCSV(categoryIndex) {
        const category = sentenceData.categories[categoryIndex];
        let csv = '越南語,中文,發音,情境\n';
        
        category.sentences.forEach(sentence => {
            csv += `"${sentence.vietnamese}","${sentence.chinese}","${sentence.pronunciation}","${sentence.situation}"\n`;
        });

        // 添加 BOM 標記以確保 UTF-8 編碼正確顯示
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${category.name}_sentences.csv`;
        link.click();
        
        // 清理 URL
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
        }, 100);
    }
}

// 如果還沒有創建實例，則創建一個
if (!window.contentManager) {
    window.contentManager = new ContentManager();
    console.log('contentManager 已載入:', typeof window.contentManager);
}