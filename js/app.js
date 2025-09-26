// 主應用程式類別
class VietnamLanguageLearning {
    constructor() {
        try {
            this.currentPage = 'vocabulary';
            this.currentCardIndex = 0;
            this.currentCategoryIndex = 0;
            // 句子學習索引
            this.currentSentenceCategoryIndex = 0;
            this.currentSentenceIndex = 0;
            console.log('應用程式初始化');
            
            // 檢查必要的資料是否存在
            if (!vocabularyData || !sentenceData) {
                throw new Error('資料未正確載入');
            }
            
            console.log('vocabularyData:', vocabularyData);
            console.log('sentenceData:', sentenceData);
            this.initializeEventListeners();
            this.initTheme();
            this.updateNavOffset();
            window.addEventListener('resize', () => this.updateNavOffset());
            // 延遲載入首頁，避免初始化競爭
            setTimeout(() => this.loadPage('vocabulary'), 100);
        } catch (error) {
            console.error('應用程式初始化失敗:', error);
            document.getElementById('mainContent').innerHTML = `
                <div class="alert alert-danger">
                    <h4>載入錯誤</h4>
                    <p>應用程式初始化失敗: ${error.message}</p>
                    <p>請檢查瀏覽器控制台獲取更多資訊。</p>
                </div>
            `;
        }
    }

    initializeEventListeners() {
        // 導航選單點擊事件
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                console.log('導航點擊:', page);
                this.loadPage(page);
            });
        });
    }

    // 主題初始化
    initTheme() {
        try {
            const saved = localStorage.getItem('vl_theme');
            if (saved) {
                if (saved === 'dark') document.body.classList.add('dark-theme');
            } else {
                // 系統偏好偵測
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.classList.add('dark-theme');
                }
            }
        } catch(e) { /* ignore */ }
        const btn = document.getElementById('themeToggleBtn');
        if (btn) {
            this.updateThemeButtonIcon();
            btn.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        try { localStorage.setItem('vl_theme', isDark ? 'dark' : 'light'); } catch(e) { /* ignore */ }
        this.updateThemeButtonIcon();
    }

    updateThemeButtonIcon() {
        const btn = document.getElementById('themeToggleBtn');
        if (!btn) return;
        const isDark = document.body.classList.contains('dark-theme');
        btn.textContent = isDark ? '☀️' : '🌙';
        btn.setAttribute('title', isDark ? '切換為亮色主題' : '切換為深色主題');
        btn.setAttribute('aria-label', btn.getAttribute('title'));
    }

    // 動態設定導覽列高度補償，避免 sticky 遮住內容
    updateNavOffset() {
        const nav = document.querySelector('.app-navbar');
        if (nav) {
            const h = nav.offsetHeight;
            document.documentElement.style.setProperty('--nav-height', h + 'px');
            document.body.classList.add('with-sticky-offset');
        }
    }

    loadPage(page) {
        this.currentPage = page;
        const mainContent = document.getElementById('mainContent');
        // 更新導覽列 active 樣式
        document.querySelectorAll('.nav-link').forEach(link => {
            const isActive = link.getAttribute('data-page') === page;
            if (isActive) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        switch(page) {
            case 'vocabulary':
                this.loadVocabularyPage();
                break;
            case 'sentences':
                this.loadSentencesPage();
                break;
            case 'grammar':
                this.loadGrammarPage();
                break;
            case 'speaking':
                this.loadSpeakingPage();
                break;
            case 'progress':
                this.loadProgressPage();
                break;
            case 'content':
                this.loadContentManagementPage();
                break;
        }
    }

    loadVocabularyPage() {
        const mainContent = document.getElementById('mainContent');
        const currentCategory = vocabularyData.categories[this.currentCategoryIndex];
        const currentWord = currentCategory.words[this.currentCardIndex];
        
        mainContent.innerHTML = `
            <h2 class="section-title">單字學習</h2>
            <div class="toolbar-line">
                <div class="toolbar-group">
                    <label class="form-label small mb-0 me-2">分類</label>
                    <select class="form-select form-select-sm w-auto" onchange="console.log('下拉選單變更:', this.value); app.changeCategory(this.value)" aria-label="選擇單字分類" title="選擇單字分類" style="cursor: pointer !important;">
                        ${vocabularyData.categories.map((cat, index) => `<option value="${index}" ${index === this.currentCategoryIndex ? 'selected' : ''}>${cat.name}</option>`).join('')}
                    </select>
                </div>
                <div class="toolbar-group gap-1">
                    <button class="btn btn-ghost btn-sm" onclick="console.log('+ 單字按鈕被點擊'); app.showQuickAddVocab()" style="cursor: pointer !important;">+ 單字</button>
                    <button class="btn btn-ghost btn-sm" onclick="console.log('已學按鈕被點擊'); app.markAsLearned()" style="cursor: pointer !important;">✔ 已學</button>
                </div>
            </div>
            <div class="content-layout">
                <div class="primary-area">
                    <div class="flashcard minimal" onclick="if(event.target.closest('.card-controls')) return; app.flipCard(this)">
                        <div class="flashcard-inner">
                            <div class="flashcard-front">
                                <div class="card-main-text">${currentWord.vietnamese || '載入中...'}</div>
                                <div class="pronounce">${currentWord.pronunciation || ''}</div>
                                <div class="flip-hint">點擊翻面</div>
                            </div>
                            <div class="flashcard-back">
                                <div class="card-main-text">${currentWord.chinese || '載入中...'}</div>
                                <div class="example-text">${currentWord.example || ''}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-controls">
                        <button class="btn btn-ghost" onclick="event.stopPropagation(); console.log('Previous clicked'); app.previousCard()" title="上一張" aria-label="上一張卡片">←</button>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); console.log('Next clicked'); app.nextCard()" title="下一張" aria-label="下一張卡片">下一個</button>
                        <button class="btn btn-ghost" onclick="event.stopPropagation(); console.log('Speak clicked'); app.speakCurrentWord()" title="播放發音" aria-label="播放越南語發音">🔊</button>
                        <span class="chip">${this.currentCardIndex + 1} / ${currentCategory.words.length}</span>
                    </div>
                </div>
                <aside class="side-area">
                    <div class="panel">
                        <div class="panel-header">練習測驗</div>
                        <div class="quiz-buttons">
                            <button class="btn btn-outline-primary btn-sm" onclick="console.log('選擇題按鈕被點擊'); app.startVocabularyQuiz()" style="cursor: pointer !important;">選擇題</button>
                            <button class="btn btn-outline-primary btn-sm" onclick="console.log('填空按鈕被點擊'); app.startFillInBlank()" style="cursor: pointer !important;">填空</button>
                            <button class="btn btn-outline-primary btn-sm" onclick="console.log('聽力按鈕被點擊'); app.startListeningQuiz()" style="cursor: pointer !important;">聽力</button>
                        </div>
                        <div id="quizContent" class="quiz-placeholder text-muted small mt-2">選擇上方類型開始</div>
                    </div>
                </aside>
            </div>
        `;
    }

    loadSentencesPage() {
        console.log('loadSentencesPage 被調用');
        const mainContent = document.getElementById('mainContent');
        const currentCategory = sentenceData.categories[this.currentSentenceCategoryIndex];
        const currentSentence = currentCategory.sentences[this.currentSentenceIndex];
        console.log('當前句子分類:', currentCategory.name, '句子索引:', this.currentSentenceIndex);

        mainContent.innerHTML = `
            <h2 class="section-title">句子練習</h2>
            <div class="toolbar-line">
                <div class="toolbar-group">
                    <label class="form-label small mb-0 me-2">分類</label>
                    <select class="form-select form-select-sm w-auto" onchange="console.log('句子下拉選單變更:', this.value); app.changeSentenceCategory(this.value)" aria-label="選擇句子分類" title="選擇句子分類">
                        ${sentenceData.categories.map((cat, idx) => `<option value="${idx}" ${idx === this.currentSentenceCategoryIndex ? 'selected' : ''}>${cat.name}</option>`).join('')}
                    </select>
                </div>
                <div class="toolbar-group gap-1">
                    <button class="btn btn-ghost btn-sm" onclick="app.showQuickAddSentence()">+ 句子</button>
                    <button class="btn btn-ghost btn-sm" onclick="app.markSentenceAsLearned()">✔ 已學</button>
                    <button class="btn btn-ghost btn-sm" onclick="console.log('測試按鈕被點擊'); app.changeSentenceCategory(1)">測試切換</button>
                </div>
            </div>
            <div class="content-layout">
                <div class="primary-area">
                    <div class="flashcard minimal" onclick="if(event.target.closest('.card-controls')) return; app.flipSentenceCard(this)">
                        <div class="flashcard-inner">
                            <div class="flashcard-front">
                                <div class="card-main-text">${currentSentence.vietnamese}</div>
                                <div class="pronounce">${currentSentence.pronunciation || ''}</div>
                                <div class="flip-hint">點擊翻面</div>
                            </div>
                            <div class="flashcard-back">
                                <div class="card-main-text">${currentSentence.chinese}</div>
                                <div class="example-text">${currentSentence.situation ? '情境：' + currentSentence.situation : ''}</div>
                            </div>
                        </div>
                    </div>
                    <div class="card-controls">
                        <button class="btn btn-ghost" onclick="event.stopPropagation(); app.previousSentence()" title="上一句" aria-label="上一句練習">←</button>
                        <button class="btn btn-primary" onclick="event.stopPropagation(); app.nextSentence()" title="下一句" aria-label="下一句練習">下一句</button>
                        <button class="btn btn-ghost" onclick="event.stopPropagation(); app.playSentence(\`${currentSentence.vietnamese}\`)" title="播放發音" aria-label="播放越南語句子發音">🔊</button>
                        <span class="chip">${this.currentSentenceIndex + 1} / ${currentCategory.sentences.length}</span>
                    </div>
                </div>
                <aside class="side-area">
                    <div class="panel">
                        <div class="panel-header">發音跟讀</div>
                        <div class="practice-panel">
                            <div class="practice-buttons">
                                <button class="btn btn-outline-primary btn-sm" onclick="app.playSentence(\`${currentSentence.vietnamese}\`)">示範</button>
                                <button class="btn btn-outline-primary btn-sm" onclick="app.startRecording()">錄音</button>
                                <button class="btn btn-outline-primary btn-sm" onclick="app.stopRecording()">停止</button>
                            </div>
                            <div id="pronunciationFeedback" class="pronunciation-feedback small text-muted mt-2">錄音後顯示比對結果</div>
                        </div>
                    </div>
                </aside>
            </div>
        `;
    }

    loadGrammarPage() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2 class="section-title">文法學習</h2>
            <div class="grammar-content">
                <h3>基本句型</h3>
                <div class="grammar-explanation">
                    <p>越南語的基本語序是「主語 + 動詞 + 賓語」(SVO)</p>
                    <div class="example">
                        <p>Tôi ăn cơm</p>
                        <p>我吃飯</p>
                        <p class="breakdown">我(Tôi) + 吃(ăn) + 飯(cơm)</p>
                    </div>
                </div>
            </div>
        `;
    }

    loadSpeakingPage() {
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2 class="section-title">口語練習</h2>
            <div class="speaking-layout">
                <div class="panel flex-column gap-2">
                    <div class="panel-header">快速練習</div>
                    <div class="speaking-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="app.playPronunciation()">示範</button>
                        <button class="btn btn-outline-primary btn-sm" onclick="app.startRecording()">開始</button>
                        <button class="btn btn-outline-primary btn-sm" onclick="app.stopRecording()">停止</button>
                    </div>
                    <div class="small text-muted">可先在句子練習挑選想跟讀的句子，再回到此處集中練習。</div>
                    <div id="pronunciationFeedback" class="pronunciation-feedback small text-muted">尚未開始錄音</div>
                </div>
            </div>
        `;
    }

    loadProgressPage() {
        console.log('載入學習進度頁面');
        const mainContent = document.getElementById('mainContent');
        const data = storageManager.loadData();
        const vocabProgress = storageManager.getProgressPercentage('vocabulary');
        const sentenceProgress = storageManager.getProgressPercentage('sentences');
        
        const vocabCategoriesHTML = vocabularyData.categories.map((category, index) => {
            const categoryProgress = storageManager.getProgressPercentage('vocabulary', index);
            return `
                <div class="mini-row">
                    <span class="mini-label" title="${category.name}">${category.name}</span>
                    <div class="mini-bar-wrapper" aria-label="${category.name} 單字進度 ${categoryProgress}%">
                        <div class="mini-bar" style="width:${categoryProgress}%"></div>
                    </div>
                    <span class="mini-value">${categoryProgress}%</span>
                </div>
            `;
        }).join('');

        const sentenceCategoriesHTML = sentenceData.categories.map((category, index) => {
            const categoryProgress = storageManager.getProgressPercentage('sentences', index);
            return `
                <div class="mini-row">
                    <span class="mini-label" title="${category.name}">${category.name}</span>
                    <div class="mini-bar-wrapper" aria-label="${category.name} 句子進度 ${categoryProgress}%">
                        <div class="mini-bar alt" style="width:${categoryProgress}%"></div>
                    </div>
                    <span class="mini-value">${categoryProgress}%</span>
                </div>
            `;
        }).join('');

        mainContent.innerHTML = `
            <h2 class="section-title">學習進度</h2>
            <div class="stats-summary">
                <div class="stat-item">
                    <div class="stat-label">已學單字</div>
                    <div class="stat-value">${data.statistics.wordsLearned}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">已學句子</div>
                    <div class="stat-value">${data.statistics.sentencesLearned}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">連續天數</div>
                    <div class="stat-value">${data.statistics.dailyStreak}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">總時間(分)</div>
                    <div class="stat-value">${Math.round(data.statistics.totalStudyTime / 60)}</div>
                </div>
            </div>
            <div class="progress-layout">
                <div class="panel">
                    <div class="panel-header flex-between">單字進度 <span class="overall chip">${vocabProgress}%</span></div>
                    <div class="mini-progress-list">${vocabCategoriesHTML}</div>
                </div>
                <div class="panel">
                    <div class="panel-header flex-between">句子進度 <span class="overall chip alt">${sentenceProgress}%</span></div>
                    <div class="mini-progress-list">${sentenceCategoriesHTML}</div>
                </div>
                <div class="panel management-panel">
                    <div class="panel-header">資料與編輯</div>
                    <div class="manage-buttons">
                        <button class="btn btn-outline-primary btn-sm" onclick="contentEditor.showVocabularyList()">單字</button>
                        <button class="btn btn-outline-primary btn-sm" onclick="contentEditor.showSentenceList()">句子</button>
                        <button class="btn btn-outline-primary btn-sm" onclick="app.exportData()">匯出</button>
                        <button class="btn btn-outline-primary btn-sm" onclick="app.importData()">匯入</button>
                        <button class="btn btn-outline-danger btn-sm" onclick="app.resetData()">重設</button>
                    </div>
                    <input type="file" id="importFile" style="display:none" accept=".json" onchange="app.handleImportFile(this)">
                </div>
            </div>
        `;
    }

    // 翻卡功能
    flipCard(card) {
        card.classList.toggle('flipped');
    }

    // 切換分類
    changeCategory(categoryIndex) {
        console.log('changeCategory 被調用，參數:', categoryIndex);
        this.currentCategoryIndex = parseInt(categoryIndex);
        this.currentCardIndex = 0;
        console.log('切換到分類索引:', this.currentCategoryIndex);
        this.loadVocabularyPage();
    }

    // 下一張卡片
    nextCard() {
        console.log('nextCard called, current index:', this.currentCardIndex);
        const currentCategory = vocabularyData.categories[this.currentCategoryIndex];
        if (this.currentCardIndex < currentCategory.words.length - 1) {
            this.currentCardIndex++;
        } else {
            this.currentCardIndex = 0; // 回到第一張
        }
        console.log('new index:', this.currentCardIndex);
        this.loadVocabularyPage();
    }

    // 上一張卡片
    previousCard() {
        console.log('previousCard called, current index:', this.currentCardIndex);
        const currentCategory = vocabularyData.categories[this.currentCategoryIndex];
        if (this.currentCardIndex > 0) {
            this.currentCardIndex--;
        } else {
            this.currentCardIndex = currentCategory.words.length - 1; // 回到最後一張
        }
        console.log('new index:', this.currentCardIndex);
        this.loadVocabularyPage();
    }

    // 播放當前單字
    speakCurrentWord() {
        const currentWord = vocabularyData.categories[this.currentCategoryIndex].words[this.currentCardIndex];
        speechManager.speakVietnamese(currentWord.vietnamese);
    }

    // 標記為已學會
    markAsLearned() {
        storageManager.updateVocabularyProgress(this.currentCategoryIndex, this.currentCardIndex, true);
        alert('已標記為學會！');
        this.nextCard();
    }

    // 句子標記學會
    markSentenceAsLearned() {
        storageManager.updateSentenceProgress(this.currentSentenceCategoryIndex, this.currentSentenceIndex, true);
        alert('句子已標記為學會');
        this.nextSentence();
    }

    // 開始單字測驗
    startVocabularyQuiz() {
        try {
            if (window.quizManager) {
                const questions = quizManager.generateVocabularyQuiz(this.currentCategoryIndex);
                quizManager.startQuiz(questions);
            } else {
                console.log('測驗功能尚未載入');
                document.getElementById('quizContent').innerHTML = '<p class="text-muted">測驗功能載入中...</p>';
            }
        } catch (error) {
            console.error('啟動單字測驗失敗:', error);
        }
    }

    // 開始填空測驗
    startFillInBlank() {
        try {
            if (window.quizManager) {
                const questions = quizManager.generateFillInBlank(this.currentCategoryIndex);
                quizManager.startQuiz(questions);
            } else {
                console.log('測驗功能尚未載入');
                document.getElementById('quizContent').innerHTML = '<p class="text-muted">測驗功能載入中...</p>';
            }
        } catch (error) {
            console.error('啟動填空測驗失敗:', error);
        }
    }

    // 開始聽力測驗
    startListeningQuiz() {
        try {
            if (window.quizManager) {
                const questions = quizManager.generateListeningQuiz(this.currentCategoryIndex);
                quizManager.startQuiz(questions);
            } else {
                console.log('測驗功能尚未載入');
                document.getElementById('quizContent').innerHTML = '<p class="text-muted">測驗功能載入中...</p>';
            }
        } catch (error) {
            console.error('啟動聽力測驗失敗:', error);
        }
    }

    // 語音相關功能
    playSentence(text = "Bạn có khỏe không?") {
        if (speechManager) {
            speechManager.speakVietnamese(text);
        }
    }

    // 句子分類切換
    changeSentenceCategory(idx) {
        console.log('changeSentenceCategory 被調用，參數:', idx);
        this.currentSentenceCategoryIndex = parseInt(idx);
        this.currentSentenceIndex = 0;
        console.log('切換到分類索引:', this.currentSentenceCategoryIndex);
        this.loadSentencesPage();
    }

    nextSentence() {
        const currentCategory = sentenceData.categories[this.currentSentenceCategoryIndex];
        if (this.currentSentenceIndex < currentCategory.sentences.length - 1) {
            this.currentSentenceIndex++;
        } else {
            this.currentSentenceIndex = 0;
        }
        this.loadSentencesPage();
    }

    previousSentence() {
        const currentCategory = sentenceData.categories[this.currentSentenceCategoryIndex];
        if (this.currentSentenceIndex > 0) {
            this.currentSentenceIndex--;
        } else {
            this.currentSentenceIndex = currentCategory.sentences.length - 1;
        }
        this.loadSentencesPage();
    }

    flipSentenceCard(element) {
        console.log('flipSentenceCard 被調用');
        element.classList.toggle('flipped');
        console.log('句子卡片翻轉:', element.classList.contains('flipped') ? '背面' : '正面');
    }

    // 錄音相關功能
    startRecording() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    // TODO: 實現錄音邏輯
                })
                .catch(err => {
                    console.error('錄音失敗:', err);
                });
        }
    }

    stopRecording() {
        speechManager.stopRecognition();
    }

    // 資料管理功能
    exportData() {
        storageManager.exportData();
    }

    importData() {
        document.getElementById('importFile').click();
    }

    handleImportFile(input) {
        const file = input.files[0];
        if (file) {
            storageManager.importData(file)
                .then(message => {
                    alert(message);
                    this.loadProgressPage();
                })
                .catch(error => {
                    alert(error);
                });
        }
    }

    resetData() {
        if (confirm('確定要重設所有學習資料嗎？此操作不可復原！')) {
            storageManager.resetAllData();
            alert('資料已重設！');
            this.loadProgressPage();
        }
    }

    // 內容管理頁面
    loadContentManagementPage() {
        const mainContent = document.getElementById('mainContent');
        
        // 設置表單事件監聽器
        setTimeout(() => {
            this.setupContentManagementEvents();
        }, 100);
        mainContent.innerHTML = `
            <h2 class="section-title">內容管理</h2>
            
            <div class="row">
                <!-- 匯入內容 -->
                <div class="col-md-6">
                    <div class="progress-card">
                        <h4>匯入學習內容</h4>
                        
                        <div class="mb-3">
                            <h5>單字匯入</h5>
                            <p class="text-muted">支援 CSV 格式：越南語,中文,發音,例句</p>
                            <input type="file" class="form-control mb-2" id="vocabularyFile" accept=".csv,.txt">
                            <button class="btn btn-primary btn-sm" onclick="app.importVocabulary()">匯入單字</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="contentManager.generateVocabularyTemplate()">下載範本</button>
                        </div>
                        
                        <div class="mb-3">
                            <h5>句子匯入</h5>
                            <p class="text-muted">支援 CSV 格式：越南語,中文,發音,情境</p>
                            <input type="file" class="form-control mb-2" id="sentenceFile" accept=".csv,.txt">
                            <button class="btn btn-success btn-sm" onclick="app.importSentences()">匯入句子</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="contentManager.generateSentenceTemplate()">下載範本</button>
                        </div>
                        
                        <div class="mb-3">
                            <h5>文法匯入</h5>
                            <p class="text-muted">支援 JSON 格式</p>
                            <input type="file" class="form-control mb-2" id="grammarFile" accept=".json">
                            <button class="btn btn-info btn-sm" onclick="app.importGrammar()">匯入文法</button>
                            <button class="btn btn-outline-secondary btn-sm" onclick="contentManager.generateGrammarTemplate()">下載範本</button>
                        </div>
                    </div>
                </div>
                
                <!-- 匯出內容 -->
                <div class="col-md-6">
                    <div class="progress-card">
                        <h4>匯出學習內容</h4>
                        
                        <div class="mb-3">
                            <h5>匯出單字</h5>
                            <select class="form-select mb-2" id="exportVocabCategory">
                                ${vocabularyData.categories.map((cat, index) => 
                                    `<option value="${index}">${cat.name}</option>`
                                ).join('')}
                            </select>
                            <button class="btn btn-primary btn-sm" onclick="app.exportVocabulary()">匯出為 CSV</button>
                        </div>
                        
                        <div class="mb-3">
                            <h5>匯出句子</h5>
                            <select class="form-select mb-2" id="exportSentenceCategory">
                                ${sentenceData.categories.map((cat, index) => 
                                    `<option value="${index}">${cat.name}</option>`
                                ).join('')}
                            </select>
                            <button class="btn btn-success btn-sm" onclick="app.exportSentences()">匯出為 CSV</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 手動新增內容 -->
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="progress-card">
                        <h4>手動新增單字</h4>
                        <form id="addVocabularyForm">
                            <div class="mb-2">
                                <select class="form-select" id="vocabCategorySelect">
                                    <option value="">選擇分類</option>
                                    ${vocabularyData.categories.map((cat, index) => 
                                        `<option value="${index}">${cat.name}</option>`
                                    ).join('')}
                                    <option value="new">+ 新增分類</option>
                                </select>
                                <input type="text" class="form-control mt-1" id="newVocabCategory" placeholder="新分類名稱" style="display:none">
                            </div>
                            <div class="mb-2">
                                <input type="text" class="form-control" id="newVietnamese" placeholder="越南語" required>
                            </div>
                            <div class="mb-2">
                                <input type="text" class="form-control" id="newChinese" placeholder="中文翻譯" required>
                            </div>
                            <div class="mb-2">
                                <input type="text" class="form-control" id="newPronunciation" placeholder="發音標記">
                            </div>
                            <div class="mb-2">
                                <textarea class="form-control" id="newExample" placeholder="例句" rows="2"></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">新增單字</button>
                            <button type="button" class="btn btn-secondary" onclick="app.clearVocabForm()">清除</button>
                        </form>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="progress-card">
                        <h4>手動新增句子</h4>
                        <form id="addSentenceForm">
                            <div class="mb-2">
                                <select class="form-select" id="sentenceCategorySelect">
                                    <option value="">選擇分類</option>
                                    ${sentenceData.categories.map((cat, index) => 
                                        `<option value="${index}">${cat.name}</option>`
                                    ).join('')}
                                    <option value="new">+ 新增分類</option>
                                </select>
                                <input type="text" class="form-control mt-1" id="newSentenceCategory" placeholder="新分類名稱" style="display:none">
                            </div>
                            <div class="mb-2">
                                <textarea class="form-control" id="newSentenceVietnamese" placeholder="越南語句子" rows="2" required></textarea>
                            </div>
                            <div class="mb-2">
                                <textarea class="form-control" id="newSentenceChinese" placeholder="中文翻譯" rows="2" required></textarea>
                            </div>
                            <div class="mb-2">
                                <input type="text" class="form-control" id="newSentencePronunciation" placeholder="發音標記">
                            </div>
                            <div class="mb-2">
                                <input type="text" class="form-control" id="newSituation" placeholder="使用情境">
                            </div>
                            <button type="submit" class="btn btn-success">新增句子</button>
                            <button type="button" class="btn btn-secondary" onclick="app.clearSentenceForm()">清除</button>
                        </form>
                    </div>
                </div>
            </div>

            <!-- 預覽區域 -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="progress-card">
                        <div id="importPreview">
                            <!-- 匯入預覽內容將顯示在這裡 -->
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 內容統計 -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="progress-card">
                        <h4>內容統計</h4>
                        <div class="row">
                            <div class="col-md-3 text-center">
                                <h3 class="text-primary">${vocabularyData.categories.length}</h3>
                                <p>單字分類</p>
                            </div>
                            <div class="col-md-3 text-center">
                                <h3 class="text-success">${vocabularyData.categories.reduce((total, cat) => total + cat.words.length, 0)}</h3>
                                <p>總單字數</p>
                            </div>
                            <div class="col-md-3 text-center">
                                <h3 class="text-warning">${sentenceData.categories.length}</h3>
                                <p>句子分類</p>
                            </div>
                            <div class="col-md-3 text-center">
                                <h3 class="text-info">${sentenceData.categories.reduce((total, cat) => total + cat.sentences.length, 0)}</h3>
                                <p>總句子數</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 匯入功能
    importVocabulary() {
        const fileInput = document.getElementById('vocabularyFile');
        const file = fileInput.files[0];
        if (!file) {
            alert('請選擇要匯入的檔案');
            return;
        }

        contentManager.convertFromExcel(file)
            .then(csvText => {
                const words = contentManager.importVocabulary(csvText);
                contentManager.tempData = words;
                contentManager.previewImportData(words, 'vocabulary');
            })
            .catch(error => {
                alert('檔案讀取失敗: ' + error);
            });
    }

    importSentences() {
        const fileInput = document.getElementById('sentenceFile');
        const file = fileInput.files[0];
        if (!file) {
            alert('請選擇要匯入的檔案');
            return;
        }

        contentManager.convertFromExcel(file)
            .then(csvText => {
                const sentences = contentManager.importSentences(csvText);
                contentManager.tempData = sentences;
                contentManager.previewImportData(sentences, 'sentences');
            })
            .catch(error => {
                alert('檔案讀取失敗: ' + error);
            });
    }

    importGrammar() {
        const fileInput = document.getElementById('grammarFile');
        const file = fileInput.files[0];
        if (!file) {
            alert('請選擇要匯入的檔案');
            return;
        }

        contentManager.convertFromExcel(file)
            .then(jsonText => {
                const grammar = contentManager.importGrammar(jsonText);
                if (grammar) {
                    // 合併到現有文法資料
                    grammarData.topics.push(...grammar.topics);
                    alert('文法內容匯入成功！');
                } else {
                    alert('文法檔案格式錯誤！');
                }
            })
            .catch(error => {
                alert('檔案讀取失敗: ' + error);
            });
    }

    // 匯出功能
    exportVocabulary() {
        const categoryIndex = document.getElementById('exportVocabCategory').value;
        contentManager.exportVocabularyAsCSV(parseInt(categoryIndex));
    }

    exportSentences() {
        const categoryIndex = document.getElementById('exportSentenceCategory').value;
        contentManager.exportSentencesAsCSV(parseInt(categoryIndex));
    }

    // 設置內容管理頁面的事件監聽器
    setupContentManagementEvents() {
        // 單字分類選擇變更
        const vocabCategorySelect = document.getElementById('vocabCategorySelect');
        if (vocabCategorySelect) {
            vocabCategorySelect.addEventListener('change', (e) => {
                const newCategoryInput = document.getElementById('newVocabCategory');
                if (e.target.value === 'new') {
                    newCategoryInput.style.display = 'block';
                    newCategoryInput.required = true;
                } else {
                    newCategoryInput.style.display = 'none';
                    newCategoryInput.required = false;
                    newCategoryInput.value = '';
                }
            });
        }

        // 句子分類選擇變更
        const sentenceCategorySelect = document.getElementById('sentenceCategorySelect');
        if (sentenceCategorySelect) {
            sentenceCategorySelect.addEventListener('change', (e) => {
                const newCategoryInput = document.getElementById('newSentenceCategory');
                if (e.target.value === 'new') {
                    newCategoryInput.style.display = 'block';
                    newCategoryInput.required = true;
                } else {
                    newCategoryInput.style.display = 'none';
                    newCategoryInput.required = false;
                    newCategoryInput.value = '';
                }
            });
        }

        // 單字表單提交
        const addVocabularyForm = document.getElementById('addVocabularyForm');
        if (addVocabularyForm) {
            addVocabularyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewVocabulary();
            });
        }

        // 句子表單提交
        const addSentenceForm = document.getElementById('addSentenceForm');
        if (addSentenceForm) {
            addSentenceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addNewSentence();
            });
        }
    }

    // 新增單字
    addNewVocabulary() {
        const categorySelect = document.getElementById('vocabCategorySelect');
        const newCategoryInput = document.getElementById('newVocabCategory');
        const vietnamese = document.getElementById('newVietnamese').value.trim();
        const chinese = document.getElementById('newChinese').value.trim();
        const pronunciation = document.getElementById('newPronunciation').value.trim();
        const example = document.getElementById('newExample').value.trim();

        if (!vietnamese || !chinese) {
            alert('請填寫越南語和中文翻譯');
            return;
        }

        let categoryIndex;
        let categoryName;

        if (categorySelect.value === 'new') {
            categoryName = newCategoryInput.value.trim();
            if (!categoryName) {
                alert('請輸入新分類名稱');
                return;
            }
            
            // 檢查分類是否已存在
            const existingIndex = vocabularyData.categories.findIndex(cat => cat.name === categoryName);
            if (existingIndex !== -1) {
                categoryIndex = existingIndex;
            } else {
                // 創建新分類
                vocabularyData.categories.push({
                    name: categoryName,
                    words: []
                });
                categoryIndex = vocabularyData.categories.length - 1;
            }
        } else {
            categoryIndex = parseInt(categorySelect.value);
            if (isNaN(categoryIndex)) {
                alert('請選擇分類');
                return;
            }
        }

        // 檢查單字是否已存在
        const existingWord = vocabularyData.categories[categoryIndex].words.find(
            word => word.vietnamese.toLowerCase() === vietnamese.toLowerCase()
        );

        if (existingWord) {
            if (confirm('此單字已存在，是否要更新內容？')) {
                existingWord.chinese = chinese;
                existingWord.pronunciation = pronunciation;
                existingWord.example = example;
            } else {
                return;
            }
        } else {
            // 新增單字
            vocabularyData.categories[categoryIndex].words.push({
                vietnamese: vietnamese,
                chinese: chinese,
                pronunciation: pronunciation,
                example: example,
                learned: false
            });
        }

        // 清除表單
        this.clearVocabForm();
        
        // 顯示成功訊息
        alert(`單字「${vietnamese}」已成功${existingWord ? '更新' : '新增'}到「${vocabularyData.categories[categoryIndex].name}」分類！`);
        
        // 重新載入內容統計
        this.updateContentStats();
    }

    // 新增句子
    addNewSentence() {
        const categorySelect = document.getElementById('sentenceCategorySelect');
        const newCategoryInput = document.getElementById('newSentenceCategory');
        const vietnamese = document.getElementById('newSentenceVietnamese').value.trim();
        const chinese = document.getElementById('newSentenceChinese').value.trim();
        const pronunciation = document.getElementById('newSentencePronunciation').value.trim();
        const situation = document.getElementById('newSituation').value.trim();

        if (!vietnamese || !chinese) {
            alert('請填寫越南語句子和中文翻譯');
            return;
        }

        let categoryIndex;
        let categoryName;

        if (categorySelect.value === 'new') {
            categoryName = newCategoryInput.value.trim();
            if (!categoryName) {
                alert('請輸入新分類名稱');
                return;
            }
            
            // 檢查分類是否已存在
            const existingIndex = sentenceData.categories.findIndex(cat => cat.name === categoryName);
            if (existingIndex !== -1) {
                categoryIndex = existingIndex;
            } else {
                // 創建新分類
                sentenceData.categories.push({
                    name: categoryName,
                    sentences: []
                });
                categoryIndex = sentenceData.categories.length - 1;
            }
        } else {
            categoryIndex = parseInt(categorySelect.value);
            if (isNaN(categoryIndex)) {
                alert('請選擇分類');
                return;
            }
        }

        // 檢查句子是否已存在
        const existingSentence = sentenceData.categories[categoryIndex].sentences.find(
            sentence => sentence.vietnamese.toLowerCase() === vietnamese.toLowerCase()
        );

        if (existingSentence) {
            if (confirm('此句子已存在，是否要更新內容？')) {
                existingSentence.chinese = chinese;
                existingSentence.pronunciation = pronunciation;
                existingSentence.situation = situation;
            } else {
                return;
            }
        } else {
            // 新增句子
            sentenceData.categories[categoryIndex].sentences.push({
                vietnamese: vietnamese,
                chinese: chinese,
                pronunciation: pronunciation,
                situation: situation,
                learned: false
            });
        }

        // 清除表單
        this.clearSentenceForm();
        
        // 顯示成功訊息
        alert(`句子「${vietnamese}」已成功${existingSentence ? '更新' : '新增'}到「${sentenceData.categories[categoryIndex].name}」分類！`);
        
        // 重新載入內容統計
        this.updateContentStats();
    }

    // 清除單字表單
    clearVocabForm() {
        document.getElementById('vocabCategorySelect').value = '';
        document.getElementById('newVocabCategory').style.display = 'none';
        document.getElementById('newVocabCategory').value = '';
        document.getElementById('newVietnamese').value = '';
        document.getElementById('newChinese').value = '';
        document.getElementById('newPronunciation').value = '';
        document.getElementById('newExample').value = '';
    }

    // 清除句子表單
    clearSentenceForm() {
        document.getElementById('sentenceCategorySelect').value = '';
        document.getElementById('newSentenceCategory').style.display = 'none';
        document.getElementById('newSentenceCategory').value = '';
        document.getElementById('newSentenceVietnamese').value = '';
        document.getElementById('newSentenceChinese').value = '';
        document.getElementById('newSentencePronunciation').value = '';
        document.getElementById('newSituation').value = '';
    }

    // 更新內容統計
    updateContentStats() {
        // 如果在內容管理頁面，重新載入以更新統計
        if (this.currentPage === 'content') {
            setTimeout(() => {
                this.loadContentManagementPage();
            }, 100);
        }
    }

    // 顯示快速新增單字對話框
    showQuickAddVocab() {
        const modal = this.createModal('quickAddVocab', '快速新增單字', `
            <form id="quickVocabForm">
                <div class="mb-3">
                    <label class="form-label">分類</label>
                    <select class="form-select" id="quickVocabCategory">
                        ${vocabularyData.categories.map((cat, index) => 
                            `<option value="${index}" ${index === this.currentCategoryIndex ? 'selected' : ''}>${cat.name}</option>`
                        ).join('')}
                        <option value="new">+ 新增分類</option>
                    </select>
                    <input type="text" class="form-control mt-2" id="quickNewVocabCategory" placeholder="新分類名稱" style="display:none">
                </div>
                <div class="mb-3">
                    <label class="form-label">越南語 *</label>
                    <input type="text" class="form-control" id="quickVietnamese" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">中文翻譯 *</label>
                    <input type="text" class="form-control" id="quickChinese" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">發音標記</label>
                    <input type="text" class="form-control" id="quickPronunciation">
                </div>
                <div class="mb-3">
                    <label class="form-label">例句</label>
                    <textarea class="form-control" id="quickExample" rows="2"></textarea>
                </div>
            </form>
        `, [
            { text: '新增', class: 'btn-primary', onclick: 'app.submitQuickVocab()' },
            { text: '取消', class: 'btn-secondary', onclick: 'app.closeModal("quickAddVocab")' }
        ]);

        // 設置分類選擇事件
        setTimeout(() => {
            const categorySelect = document.getElementById('quickVocabCategory');
            const newCategoryInput = document.getElementById('quickNewVocabCategory');
            
            categorySelect.addEventListener('change', (e) => {
                if (e.target.value === 'new') {
                    newCategoryInput.style.display = 'block';
                    newCategoryInput.required = true;
                } else {
                    newCategoryInput.style.display = 'none';
                    newCategoryInput.required = false;
                }
            });
        }, 100);
    }

    // 顯示快速新增句子對話框
    showQuickAddSentence() {
        const modal = this.createModal('quickAddSentence', '快速新增句子', `
            <form id="quickSentenceForm">
                <div class="mb-3">
                    <label class="form-label">分類</label>
                    <select class="form-select" id="quickSentenceCategory">
                        ${sentenceData.categories.map((cat, index) => 
                            `<option value="${index}">${cat.name}</option>`
                        ).join('')}
                        <option value="new">+ 新增分類</option>
                    </select>
                    <input type="text" class="form-control mt-2" id="quickNewSentenceCategory" placeholder="新分類名稱" style="display:none">
                </div>
                <div class="mb-3">
                    <label class="form-label">越南語句子 *</label>
                    <textarea class="form-control" id="quickSentenceVietnamese" rows="2" required></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">中文翻譯 *</label>
                    <textarea class="form-control" id="quickSentenceChinese" rows="2" required></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">發音標記</label>
                    <input type="text" class="form-control" id="quickSentencePronunciation">
                </div>
                <div class="mb-3">
                    <label class="form-label">使用情境</label>
                    <input type="text" class="form-control" id="quickSituation">
                </div>
            </form>
        `, [
            { text: '新增', class: 'btn-success', onclick: 'app.submitQuickSentence()' },
            { text: '取消', class: 'btn-secondary', onclick: 'app.closeModal("quickAddSentence")' }
        ]);

        // 設置分類選擇事件
        setTimeout(() => {
            const categorySelect = document.getElementById('quickSentenceCategory');
            const newCategoryInput = document.getElementById('quickNewSentenceCategory');
            
            categorySelect.addEventListener('change', (e) => {
                if (e.target.value === 'new') {
                    newCategoryInput.style.display = 'block';
                    newCategoryInput.required = true;
                } else {
                    newCategoryInput.style.display = 'none';
                    newCategoryInput.required = false;
                }
            });
        }, 100);
    }

    // 創建模態對話框
    createModal(id, title, body, buttons = []) {
        // 移除已存在的模態
        const existingModal = document.getElementById(id);
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = id;
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${title}</h5>
                        <button type="button" class="btn-close" onclick="app.closeModal('${id}')"></button>
                    </div>
                    <div class="modal-body">
                        ${body}
                    </div>
                    <div class="modal-footer">
                        ${buttons.map(btn => 
                            `<button type="button" class="btn ${btn.class}" onclick="${btn.onclick}">${btn.text}</button>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 顯示模態
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();

        return modal;
    }

    // 關閉模態對話框
    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    }

    // 提交快速新增單字
    submitQuickVocab() {
        const categorySelect = document.getElementById('quickVocabCategory');
        const newCategoryInput = document.getElementById('quickNewVocabCategory');
        const vietnamese = document.getElementById('quickVietnamese').value.trim();
        const chinese = document.getElementById('quickChinese').value.trim();
        const pronunciation = document.getElementById('quickPronunciation').value.trim();
        const example = document.getElementById('quickExample').value.trim();

        if (!vietnamese || !chinese) {
            alert('請填寫越南語和中文翻譯');
            return;
        }

        let categoryIndex;

        if (categorySelect.value === 'new') {
            const categoryName = newCategoryInput.value.trim();
            if (!categoryName) {
                alert('請輸入新分類名稱');
                return;
            }
            
            const existingIndex = vocabularyData.categories.findIndex(cat => cat.name === categoryName);
            if (existingIndex !== -1) {
                categoryIndex = existingIndex;
            } else {
                vocabularyData.categories.push({
                    name: categoryName,
                    words: []
                });
                categoryIndex = vocabularyData.categories.length - 1;
            }
        } else {
            categoryIndex = parseInt(categorySelect.value);
        }

        // 新增單字
        vocabularyData.categories[categoryIndex].words.push({
            vietnamese: vietnamese,
            chinese: chinese,
            pronunciation: pronunciation,
            example: example,
            learned: false
        });

        alert(`單字「${vietnamese}」已成功新增！`);
        this.closeModal('quickAddVocab');

        // 如果在單字學習頁面，重新載入
        if (this.currentPage === 'vocabulary') {
            this.loadVocabularyPage();
        }
    }

    // 提交快速新增句子
    submitQuickSentence() {
        const categorySelect = document.getElementById('quickSentenceCategory');
        const newCategoryInput = document.getElementById('quickNewSentenceCategory');
        const vietnamese = document.getElementById('quickSentenceVietnamese').value.trim();
        const chinese = document.getElementById('quickSentenceChinese').value.trim();
        const pronunciation = document.getElementById('quickSentencePronunciation').value.trim();
        const situation = document.getElementById('quickSituation').value.trim();

        if (!vietnamese || !chinese) {
            alert('請填寫越南語句子和中文翻譯');
            return;
        }

        let categoryIndex;

        if (categorySelect.value === 'new') {
            const categoryName = newCategoryInput.value.trim();
            if (!categoryName) {
                alert('請輸入新分類名稱');
                return;
            }
            
            const existingIndex = sentenceData.categories.findIndex(cat => cat.name === categoryName);
            if (existingIndex !== -1) {
                categoryIndex = existingIndex;
            } else {
                sentenceData.categories.push({
                    name: categoryName,
                    sentences: []
                });
                categoryIndex = sentenceData.categories.length - 1;
            }
        } else {
            categoryIndex = parseInt(categorySelect.value);
        }

        // 新增句子
        sentenceData.categories[categoryIndex].sentences.push({
            vietnamese: vietnamese,
            chinese: chinese,
            pronunciation: pronunciation,
            situation: situation,
            learned: false
        });

        alert(`句子「${vietnamese}」已成功新增！`);
        this.closeModal('quickAddSentence');

        // 如果在句子學習頁面，重新載入
        if (this.currentPage === 'sentences') {
            this.loadSentencesPage();
        }
    }
}

// 強制設置所有可點擊元素的cursor樣式
function forceSetCursorPointer() {
    console.log('開始強制設置cursor pointer');
    
    // 選擇所有可能的可點擊元素
    const selectors = [
        'button',
        '.btn',
        '.btn-primary',
        '.btn-secondary', 
        '.btn-outline-primary',
        '.btn-outline-secondary',
        '.btn-ghost',
        '.btn-sm',
        '.btn-outline-danger',
        '.btn-success',
        '.btn-info',
        'select',
        '.form-select',
        'input[type="button"]',
        'input[type="submit"]',
        '[onclick]',
        '.nav-link',
        '.navbar-toggler',
        '[role="button"]',
        '.card-controls button'
    ];
    
    // 動態創建最高優先級的CSS規則
    let existingStyle = document.getElementById('force-cursor-style');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    const style = document.createElement('style');
    style.id = 'force-cursor-style';
    style.textContent = `
        button, .btn, .btn-primary, .btn-secondary, .btn-outline-primary, 
        .btn-outline-secondary, .btn-ghost, .btn-sm, select, .form-select,
        input[type="button"], input[type="submit"], [onclick], .nav-link,
        .navbar-toggler, [role="button"], .card-controls button {
            cursor: pointer !important;
        }
        
        /* 特別針對你的按鈕 */
        .quiz-buttons button,
        .toolbar-group button,
        .card-controls button {
            cursor: pointer !important;
            pointer-events: auto !important;
        }
    `;
    document.head.appendChild(style);
    
    // 直接在每個元素上設置樣式
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // 多種方法設置cursor
            element.style.cursor = 'pointer';
            element.style.setProperty('cursor', 'pointer', 'important');
            element.setAttribute('style', (element.getAttribute('style') || '') + '; cursor: pointer !important;');
            
            // 添加CSS類
            element.classList.add('bootstrap-override');
            
            // 檢查設置結果
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.cursor !== 'pointer') {
                console.warn('元素cursor設置失敗:', element, '當前cursor:', computedStyle.cursor);
            }
        });
        console.log(`已處理 ${selector}: ${elements.length} 個元素`);
    });
    
    console.log('cursor pointer 設置完成');
}

// 初始化應用及相關管理器
if (!window.app) {
    window.app = new VietnamLanguageLearning();
    console.log('app 已載入:', typeof window.app);
    
    // 頁面完全載入後強制設置cursor
    setTimeout(() => {
        forceSetCursorPointer();
        
        // 每當頁面內容改變時重新設置
        const observer = new MutationObserver(() => {
            setTimeout(forceSetCursorPointer, 100);
        });
        
        observer.observe(document.getElementById('mainContent'), {
            childList: true,
            subtree: true
        });
    }, 500);
}

// 測試主要函數是否存在
console.log('主要函數檢查:');
console.log('app.changeCategory:', typeof app.changeCategory);
console.log('app.showQuickAddVocab:', typeof app.showQuickAddVocab);
console.log('app.markAsLearned:', typeof app.markAsLearned);
console.log('app.startVocabularyQuiz:', typeof app.startVocabularyQuiz);