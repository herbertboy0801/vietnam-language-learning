// 本地儲存管理類別
class StorageManager {
    constructor() {
        this.storageKey = 'vietnamLearningData';
        this.initializeStorage();
    }

    initializeStorage() {
        // 檢查是否已有儲存的資料，沒有則初始化
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                vocabulary: {
                    progress: {},
                    learned: {},
                    scores: {}
                },
                sentences: {
                    progress: {},
                    learned: {},
                    scores: {}
                },
                grammar: {
                    progress: {},
                    completed: {}
                },
                speaking: {
                    practice: {},
                    scores: {}
                },
                settings: {
                    speechRate: 0.8,
                    autoPlay: true,
                    showPronunciation: true
                },
                statistics: {
                    totalStudyTime: 0,
                    dailyStreak: 0,
                    lastStudyDate: null,
                    wordsLearned: 0,
                    sentencesLearned: 0
                }
            };
            this.saveData(initialData);
        }
    }

    // 儲存資料
    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('儲存資料失敗:', error);
            return false;
        }
    }

    // 讀取資料
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('讀取資料失敗:', error);
            return null;
        }
    }

    // 更新單字學習進度
    updateVocabularyProgress(categoryIndex, wordIndex, learned = true) {
        const data = this.loadData();
        if (data) {
            if (!data.vocabulary.progress[categoryIndex]) {
                data.vocabulary.progress[categoryIndex] = {};
            }
            data.vocabulary.progress[categoryIndex][wordIndex] = {
                learned: learned,
                reviewCount: (data.vocabulary.progress[categoryIndex][wordIndex]?.reviewCount || 0) + 1,
                lastReviewDate: new Date().toISOString()
            };
            
            if (learned) {
                data.statistics.wordsLearned++;
            }
            
            this.saveData(data);
        }
    }

    // 更新句子學習進度
    updateSentenceProgress(categoryIndex, sentenceIndex, learned = true) {
        const data = this.loadData();
        if (data) {
            if (!data.sentences.progress[categoryIndex]) {
                data.sentences.progress[categoryIndex] = {};
            }
            data.sentences.progress[categoryIndex][sentenceIndex] = {
                learned: learned,
                reviewCount: (data.sentences.progress[categoryIndex][sentenceIndex]?.reviewCount || 0) + 1,
                lastReviewDate: new Date().toISOString()
            };
            
            if (learned) {
                data.statistics.sentencesLearned++;
            }
            
            this.saveData(data);
        }
    }

    // 儲存測驗分數
    saveQuizScore(type, categoryIndex, score, totalQuestions) {
        const data = this.loadData();
        if (data) {
            const scoreKey = `${type}_${categoryIndex}`;
            if (!data[type].scores[scoreKey]) {
                data[type].scores[scoreKey] = [];
            }
            
            data[type].scores[scoreKey].push({
                score: score,
                total: totalQuestions,
                date: new Date().toISOString(),
                percentage: Math.round((score / totalQuestions) * 100)
            });
            
            this.saveData(data);
        }
    }

    // 更新每日學習統計
    updateDailyStats(studyTime) {
        const data = this.loadData();
        if (data) {
            const today = new Date().toDateString();
            const lastStudyDate = data.statistics.lastStudyDate;
            
            // 更新學習時間
            data.statistics.totalStudyTime += studyTime;
            
            // 檢查連續學習天數
            if (lastStudyDate && lastStudyDate === today) {
                // 今天已經學習過了，不增加連續天數
            } else if (lastStudyDate && new Date(lastStudyDate).getTime() === new Date(today).getTime() - 86400000) {
                // 昨天有學習，增加連續天數
                data.statistics.dailyStreak++;
            } else {
                // 中斷連續學習，重新開始計算
                data.statistics.dailyStreak = 1;
            }
            
            data.statistics.lastStudyDate = today;
            this.saveData(data);
        }
    }

    // 獲取學習進度百分比
    getProgressPercentage(type, categoryIndex = null) {
        const data = this.loadData();
        if (!data) return 0;
        
        let totalItems = 0;
        let learnedItems = 0;
        
        if (type === 'vocabulary') {
            if (categoryIndex !== null) {
                totalItems = vocabularyData.categories[categoryIndex].words.length;
                const categoryProgress = data.vocabulary.progress[categoryIndex] || {};
                learnedItems = Object.values(categoryProgress).filter(item => item.learned).length;
            } else {
                vocabularyData.categories.forEach((category, catIndex) => {
                    totalItems += category.words.length;
                    const categoryProgress = data.vocabulary.progress[catIndex] || {};
                    learnedItems += Object.values(categoryProgress).filter(item => item.learned).length;
                });
            }
        } else if (type === 'sentences') {
            if (categoryIndex !== null) {
                totalItems = sentenceData.categories[categoryIndex].sentences.length;
                const categoryProgress = data.sentences.progress[categoryIndex] || {};
                learnedItems = Object.values(categoryProgress).filter(item => item.learned).length;
            } else {
                sentenceData.categories.forEach((category, catIndex) => {
                    totalItems += category.sentences.length;
                    const categoryProgress = data.sentences.progress[catIndex] || {};
                    learnedItems += Object.values(categoryProgress).filter(item => item.learned).length;
                });
            }
        }
        
        return totalItems > 0 ? Math.round((learnedItems / totalItems) * 100) : 0;
    }

    // 匯出資料
    exportData() {
        const data = this.loadData();
        if (data) {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `vietnam-learning-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // 匯入資料
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedData = JSON.parse(e.target.result);
                    this.saveData(importedData);
                    resolve('資料匯入成功！');
                } catch (error) {
                    reject('資料格式錯誤，匯入失敗！');
                }
            };
            reader.onerror = () => reject('檔案讀取失敗！');
            reader.readAsText(file);
        });
    }

    // 重設所有資料
    resetAllData() {
        localStorage.removeItem(this.storageKey);
        this.initializeStorage();
    }
}

// 如果還沒有創建實例，則創建一個
if (!window.storageManager) {
    window.storageManager = new StorageManager();
    console.log('storageManager 已載入:', typeof window.storageManager);
}