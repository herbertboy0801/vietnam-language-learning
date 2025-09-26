// 語音功能類別
class SpeechManager {
    constructor() {
        this.speechSynthesis = window.speechSynthesis;
        this.speechRecognition = null;
        this.isRecording = false;
        this.initSpeechRecognition();
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            this.speechRecognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.speechRecognition = new SpeechRecognition();
        }

        if (this.speechRecognition) {
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = false;
            this.speechRecognition.lang = 'vi-VN';
        }
    }

    // 播放越南語語音
    speakVietnamese(text, callback = null) {
        if (this.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.rate = 0.8; // 稍微慢一點便於學習
            utterance.pitch = 1.0;
            
            if (callback) {
                utterance.onend = callback;
            }
            
            this.speechSynthesis.speak(utterance);
        }
    }

    // 開始語音識別
    startRecognition(callback, errorCallback) {
        if (!this.speechRecognition) {
            errorCallback('您的瀏覽器不支援語音識別功能');
            return;
        }

        this.isRecording = true;
        
        this.speechRecognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            const confidence = event.results[0][0].confidence;
            callback(result, confidence);
        };

        this.speechRecognition.onerror = (event) => {
            this.isRecording = false;
            errorCallback('語音識別錯誤: ' + event.error);
        };

        this.speechRecognition.onend = () => {
            this.isRecording = false;
        };

        this.speechRecognition.start();
    }

    // 停止語音識別
    stopRecognition() {
        if (this.speechRecognition && this.isRecording) {
            this.speechRecognition.stop();
            this.isRecording = false;
        }
    }

    // 比較發音相似度（簡單的文字比較）
    comparePronunciation(original, spoken) {
        // 移除標點符號和轉為小寫
        const cleanOriginal = original.toLowerCase().replace(/[^\w\s]/gi, '');
        const cleanSpoken = spoken.toLowerCase().replace(/[^\w\s]/gi, '');
        
        // 計算相似度（簡單的字元匹配）
        const similarity = this.calculateSimilarity(cleanOriginal, cleanSpoken);
        return {
            similarity: similarity,
            feedback: this.getFeedback(similarity)
        };
    }

    calculateSimilarity(str1, str2) {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const distance = this.levenshteinDistance(longer, shorter);
        return (longer.length - distance) / longer.length;
    }

    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    getFeedback(similarity) {
        if (similarity >= 0.9) return { level: 'excellent', message: '發音非常棒！' };
        if (similarity >= 0.7) return { level: 'good', message: '發音很好，繼續加油！' };
        if (similarity >= 0.5) return { level: 'fair', message: '發音還不錯，再練習一下會更好！' };
        return { level: 'poor', message: '需要多練習，不要灰心！' };
    }
}

// 如果還沒有創建實例，則創建一個
if (!window.speechManager) {
    window.speechManager = new SpeechManager();
    console.log('speechManager 已載入:', typeof window.speechManager);
}