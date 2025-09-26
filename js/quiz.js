// 測驗和練習管理類別
class QuizManager {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.questions = [];
    }

    // 生成單字選擇題
    generateVocabularyQuiz(categoryIndex, questionCount = 5) {
        const category = vocabularyData.categories[categoryIndex];
        const questions = [];
        const usedWords = new Set();
        
        for (let i = 0; i < Math.min(questionCount, category.words.length); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * category.words.length);
            } while (usedWords.has(randomIndex));
            
            usedWords.add(randomIndex);
            const word = category.words[randomIndex];
            
            // 生成選項
            const options = [word.chinese];
            const otherWords = category.words.filter((_, index) => index !== randomIndex);
            
            while (options.length < 4 && otherWords.length > 0) {
                const randomOther = otherWords[Math.floor(Math.random() * otherWords.length)];
                if (!options.includes(randomOther.chinese)) {
                    options.push(randomOther.chinese);
                }
                otherWords.splice(otherWords.indexOf(randomOther), 1);
            }
            
            // 打亂選項順序
            for (let j = options.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [options[j], options[k]] = [options[k], options[j]];
            }
            
            questions.push({
                type: 'vocabulary',
                question: word.vietnamese,
                options: options,
                correctAnswer: word.chinese,
                explanation: word.example
            });
        }
        
        return questions;
    }

    // 生成句子選擇題
    generateSentenceQuiz(categoryIndex, questionCount = 5) {
        const category = sentenceData.categories[categoryIndex];
        const questions = [];
        const usedSentences = new Set();
        
        for (let i = 0; i < Math.min(questionCount, category.sentences.length); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * category.sentences.length);
            } while (usedSentences.has(randomIndex));
            
            usedSentences.add(randomIndex);
            const sentence = category.sentences[randomIndex];
            
            // 生成選項
            const options = [sentence.chinese];
            const otherSentences = category.sentences.filter((_, index) => index !== randomIndex);
            
            while (options.length < 4 && otherSentences.length > 0) {
                const randomOther = otherSentences[Math.floor(Math.random() * otherSentences.length)];
                if (!options.includes(randomOther.chinese)) {
                    options.push(randomOther.chinese);
                }
                otherSentences.splice(otherSentences.indexOf(randomOther), 1);
            }
            
            // 打亂選項順序
            for (let j = options.length - 1; j > 0; j--) {
                const k = Math.floor(Math.random() * (j + 1));
                [options[j], options[k]] = [options[k], options[j]];
            }
            
            questions.push({
                type: 'sentence',
                question: sentence.vietnamese,
                options: options,
                correctAnswer: sentence.chinese,
                explanation: `情境：${sentence.situation}`
            });
        }
        
        return questions;
    }

    // 生成填空題
    generateFillInBlank(categoryIndex, questionCount = 3) {
        const category = vocabularyData.categories[categoryIndex];
        const questions = [];
        const usedWords = new Set();
        
        for (let i = 0; i < Math.min(questionCount, category.words.length); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * category.words.length);
            } while (usedWords.has(randomIndex));
            
            usedWords.add(randomIndex);
            const word = category.words[randomIndex];
            
            // 從例句中創建填空題
            const example = word.example;
            const blankExample = example.replace(word.vietnamese, '_____');
            
            questions.push({
                type: 'fillInBlank',
                question: `填入正確的越南語單字：${blankExample}`,
                correctAnswer: word.vietnamese,
                explanation: `正確答案：${word.vietnamese} (${word.chinese})`
            });
        }
        
        return questions;
    }

    // 生成聽力測驗
    generateListeningQuiz(categoryIndex, questionCount = 3) {
        const category = vocabularyData.categories[categoryIndex];
        const questions = [];
        const usedWords = new Set();
        
        for (let i = 0; i < Math.min(questionCount, category.words.length); i++) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * category.words.length);
            } while (usedWords.has(randomIndex));
            
            usedWords.add(randomIndex);
            const word = category.words[randomIndex];
            
            questions.push({
                type: 'listening',
                question: '請聽語音並選擇正確的中文意思',
                audioText: word.vietnamese,
                options: [word.chinese, '其他選項1', '其他選項2', '其他選項3'],
                correctAnswer: word.chinese,
                explanation: `發音：${word.pronunciation}`
            });
        }
        
        return questions;
    }

    // 開始測驗
    startQuiz(questions) {
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.showCurrentQuestion();
    }

    // 顯示當前問題
    showCurrentQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showQuizResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        const quizContainer = document.getElementById('quizContent');
        
        let html = `
            <div class="quiz-question">
                <h4>問題 ${this.currentQuestionIndex + 1} / ${this.questions.length}</h4>
                <p class="question-text">${question.question}</p>
        `;

        if (question.type === 'listening') {
            html += `
                <button class="btn btn-info mb-3" onclick="quizManager.playAudio('${question.audioText}')">
                    🔊 播放語音
                </button>
            `;
        }

        if (question.type === 'fillInBlank') {
            html += `
                <input type="text" class="form-control mb-3" id="fillInAnswer" placeholder="請輸入答案">
                <button class="btn btn-primary" onclick="quizManager.checkFillInAnswer()">提交答案</button>
            `;
        } else {
            html += '<div class="quiz-options">';
            question.options.forEach((option, index) => {
                html += `
                    <div class="quiz-option" onclick="quizManager.selectAnswer('${option}')">
                        ${String.fromCharCode(65 + index)}. ${option}
                    </div>
                `;
            });
            html += '</div>';
        }

        html += '</div>';
        quizContainer.innerHTML = html;
    }

    // 播放音頻
    playAudio(text) {
        if (window.speechManager) {
            speechManager.speakVietnamese(text);
        }
    }

    // 選擇答案
    selectAnswer(answer) {
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = answer === question.correctAnswer;
        
        if (isCorrect) {
            this.score++;
        }
        
        this.showAnswerFeedback(isCorrect, question);
    }

    // 檢查填空答案
    checkFillInAnswer() {
        const answer = document.getElementById('fillInAnswer').value.trim();
        const question = this.questions[this.currentQuestionIndex];
        const isCorrect = answer.toLowerCase() === question.correctAnswer.toLowerCase();
        
        if (isCorrect) {
            this.score++;
        }
        
        this.showAnswerFeedback(isCorrect, question);
    }

    // 顯示答案回饋
    showAnswerFeedback(isCorrect, question) {
        const quizContainer = document.getElementById('quizContent');
        const feedbackClass = isCorrect ? 'alert-success' : 'alert-danger';
        const feedbackText = isCorrect ? '正確！' : '錯誤！';
        
        quizContainer.innerHTML = `
            <div class="alert ${feedbackClass}">
                <h4>${feedbackText}</h4>
                <p><strong>正確答案：</strong>${question.correctAnswer}</p>
                <p><strong>說明：</strong>${question.explanation}</p>
                <button class="btn btn-primary mt-2" onclick="quizManager.nextQuestion()">下一題</button>
            </div>
        `;
    }

    // 下一題
    nextQuestion() {
        this.currentQuestionIndex++;
        this.showCurrentQuestion();
    }

    // 顯示測驗結果
    showQuizResults() {
        const quizContainer = document.getElementById('quizContent');
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        let performanceText = '';
        if (percentage >= 90) performanceText = '優秀！';
        else if (percentage >= 70) performanceText = '良好！';
        else if (percentage >= 60) performanceText = '及格！';
        else performanceText = '需要加強！';
        
        quizContainer.innerHTML = `
            <div class="quiz-results alert alert-info">
                <h3>測驗結果</h3>
                <p><strong>得分：</strong>${this.score} / ${this.questions.length}</p>
                <p><strong>正確率：</strong>${percentage}%</p>
                <p><strong>評價：</strong>${performanceText}</p>
                <div class="mt-3">
                    <button class="btn btn-success" onclick="app.loadVocabularyPage()">重新測驗</button>
                    <button class="btn btn-primary" onclick="app.loadProgressPage()">查看進度</button>
                </div>
            </div>
        `;
        
        // 儲存測驗結果
        if (window.storageManager) {
            const quizType = this.questions[0].type === 'vocabulary' ? 'vocabulary' : 'sentences';
            storageManager.saveQuizScore(quizType, 0, this.score, this.questions.length);
        }
    }
}

// 創建測驗管理器實例
window.quizManager = new QuizManager();
console.log('quizManager 已載入:', typeof window.quizManager);