// 內容編輯管理類別
class ContentEditor {
    constructor() {
        this.currentEditingType = null;
        this.currentEditingIndex = null;
        this.currentCategoryIndex = null;
    }

    // 顯示單字列表管理
    showVocabularyList(categoryIndex = 0) {
        const category = vocabularyData.categories[categoryIndex];
        const modal = app.createModal('vocabularyList', `管理單字 - ${category.name}`, `
            <div class="mb-3">
                <select class="form-select" id="editCategorySelect" onchange="contentEditor.changeCategoryList(this.value, 'vocabulary')">
                    ${vocabularyData.categories.map((cat, index) => 
                        `<option value="${index}" ${index === categoryIndex ? 'selected' : ''}>${cat.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                <table class="table table-sm">
                    <thead class="table-dark sticky-top">
                        <tr>
                            <th>越南語</th>
                            <th>中文</th>
                            <th>發音</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="vocabularyTableBody">
                        ${this.generateVocabularyTableRows(categoryIndex)}
                    </tbody>
                </table>
            </div>
        `, [
            { text: '關閉', class: 'btn-secondary', onclick: 'app.closeModal("vocabularyList")' }
        ]);
    }

    // 顯示句子列表管理
    showSentenceList(categoryIndex = 0) {
        const category = sentenceData.categories[categoryIndex];
        const modal = app.createModal('sentenceList', `管理句子 - ${category.name}`, `
            <div class="mb-3">
                <select class="form-select" id="editSentenceCategorySelect" onchange="contentEditor.changeCategoryList(this.value, 'sentences')">
                    ${sentenceData.categories.map((cat, index) => 
                        `<option value="${index}" ${index === categoryIndex ? 'selected' : ''}>${cat.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div class="table-responsive" style="max-height: 400px; overflow-y: auto;">
                <table class="table table-sm">
                    <thead class="table-dark sticky-top">
                        <tr>
                            <th>越南語</th>
                            <th>中文</th>
                            <th>情境</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="sentenceTableBody">
                        ${this.generateSentenceTableRows(categoryIndex)}
                    </tbody>
                </table>
            </div>
        `, [
            { text: '關閉', class: 'btn-secondary', onclick: 'app.closeModal("sentenceList")' }
        ]);
    }

    // 生成單字表格行
    generateVocabularyTableRows(categoryIndex) {
        const category = vocabularyData.categories[categoryIndex];
        return category.words.map((word, index) => `
            <tr>
                <td>${word.vietnamese}</td>
                <td>${word.chinese}</td>
                <td>${word.pronunciation}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="contentEditor.editVocabulary(${categoryIndex}, ${index})">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="contentEditor.deleteVocabulary(${categoryIndex}, ${index})">刪除</button>
                </td>
            </tr>
        `).join('');
    }

    // 生成句子表格行
    generateSentenceTableRows(categoryIndex) {
        const category = sentenceData.categories[categoryIndex];
        return category.sentences.map((sentence, index) => `
            <tr>
                <td>${sentence.vietnamese}</td>
                <td>${sentence.chinese}</td>
                <td>${sentence.situation}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="contentEditor.editSentence(${categoryIndex}, ${index})">編輯</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="contentEditor.deleteSentence(${categoryIndex}, ${index})">刪除</button>
                </td>
            </tr>
        `).join('');
    }

    // 切換分類列表
    changeCategoryList(categoryIndex, type) {
        if (type === 'vocabulary') {
            document.getElementById('vocabularyTableBody').innerHTML = this.generateVocabularyTableRows(parseInt(categoryIndex));
        } else if (type === 'sentences') {
            document.getElementById('sentenceTableBody').innerHTML = this.generateSentenceTableRows(parseInt(categoryIndex));
        }
    }

    // 編輯單字
    editVocabulary(categoryIndex, wordIndex) {
        const word = vocabularyData.categories[categoryIndex].words[wordIndex];
        const modal = app.createModal('editVocabulary', '編輯單字', `
            <form id="editVocabularyForm">
                <div class="mb-3">
                    <label class="form-label">越南語 *</label>
                    <input type="text" class="form-control" id="editVietnamese" value="${word.vietnamese}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">中文翻譯 *</label>
                    <input type="text" class="form-control" id="editChinese" value="${word.chinese}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">發音標記</label>
                    <input type="text" class="form-control" id="editPronunciation" value="${word.pronunciation}">
                </div>
                <div class="mb-3">
                    <label class="form-label">例句</label>
                    <textarea class="form-control" id="editExample" rows="2">${word.example}</textarea>
                </div>
            </form>
        `, [
            { text: '保存', class: 'btn-primary', onclick: `contentEditor.saveVocabulary(${categoryIndex}, ${wordIndex})` },
            { text: '取消', class: 'btn-secondary', onclick: 'app.closeModal("editVocabulary")' }
        ]);
    }

    // 編輯句子
    editSentence(categoryIndex, sentenceIndex) {
        const sentence = sentenceData.categories[categoryIndex].sentences[sentenceIndex];
        const modal = app.createModal('editSentence', '編輯句子', `
            <form id="editSentenceForm">
                <div class="mb-3">
                    <label class="form-label">越南語句子 *</label>
                    <textarea class="form-control" id="editSentenceVietnamese" rows="2" required>${sentence.vietnamese}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">中文翻譯 *</label>
                    <textarea class="form-control" id="editSentenceChinese" rows="2" required>${sentence.chinese}</textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">發音標記</label>
                    <input type="text" class="form-control" id="editSentencePronunciation" value="${sentence.pronunciation}">
                </div>
                <div class="mb-3">
                    <label class="form-label">使用情境</label>
                    <input type="text" class="form-control" id="editSituation" value="${sentence.situation}">
                </div>
            </form>
        `, [
            { text: '保存', class: 'btn-success', onclick: `contentEditor.saveSentence(${categoryIndex}, ${sentenceIndex})` },
            { text: '取消', class: 'btn-secondary', onclick: 'app.closeModal("editSentence")' }
        ]);
    }

    // 保存單字編輯
    saveVocabulary(categoryIndex, wordIndex) {
        const vietnamese = document.getElementById('editVietnamese').value.trim();
        const chinese = document.getElementById('editChinese').value.trim();
        const pronunciation = document.getElementById('editPronunciation').value.trim();
        const example = document.getElementById('editExample').value.trim();

        if (!vietnamese || !chinese) {
            alert('請填寫越南語和中文翻譯');
            return;
        }

        // 更新單字
        vocabularyData.categories[categoryIndex].words[wordIndex] = {
            vietnamese: vietnamese,
            chinese: chinese,
            pronunciation: pronunciation,
            example: example,
            learned: vocabularyData.categories[categoryIndex].words[wordIndex].learned
        };

        alert('單字已更新！');
        app.closeModal('editVocabulary');

        // 重新載入列表
        this.showVocabularyList(categoryIndex);
    }

    // 保存句子編輯
    saveSentence(categoryIndex, sentenceIndex) {
        const vietnamese = document.getElementById('editSentenceVietnamese').value.trim();
        const chinese = document.getElementById('editSentenceChinese').value.trim();
        const pronunciation = document.getElementById('editSentencePronunciation').value.trim();
        const situation = document.getElementById('editSituation').value.trim();

        if (!vietnamese || !chinese) {
            alert('請填寫越南語句子和中文翻譯');
            return;
        }

        // 更新句子
        sentenceData.categories[categoryIndex].sentences[sentenceIndex] = {
            vietnamese: vietnamese,
            chinese: chinese,
            pronunciation: pronunciation,
            situation: situation,
            learned: sentenceData.categories[categoryIndex].sentences[sentenceIndex].learned
        };

        alert('句子已更新！');
        app.closeModal('editSentence');

        // 重新載入列表
        this.showSentenceList(categoryIndex);
    }

    // 刪除單字
    deleteVocabulary(categoryIndex, wordIndex) {
        const word = vocabularyData.categories[categoryIndex].words[wordIndex];
        if (confirm(`確定要刪除單字「${word.vietnamese}」嗎？`)) {
            vocabularyData.categories[categoryIndex].words.splice(wordIndex, 1);
            alert('單字已刪除！');
            this.showVocabularyList(categoryIndex);
        }
    }

    // 刪除句子
    deleteSentence(categoryIndex, sentenceIndex) {
        const sentence = sentenceData.categories[categoryIndex].sentences[sentenceIndex];
        if (confirm(`確定要刪除句子「${sentence.vietnamese}」嗎？`)) {
            sentenceData.categories[categoryIndex].sentences.splice(sentenceIndex, 1);
            alert('句子已刪除！');
            this.showSentenceList(categoryIndex);
        }
    }
}

// 如果還沒有創建實例，則創建一個
if (!window.contentEditor) {
    window.contentEditor = new ContentEditor();
    console.log('contentEditor 已載入:', typeof window.contentEditor);
}