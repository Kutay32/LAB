const defaultData = [
  { category: "Temel kavramlar", term: "Token", definition: "Büyük dil modellerinde metnin işlenen en küçük birimi (kelime, hece veya harf olabilir)." },
  { category: "Temel kavramlar", term: "Context Window", definition: "Bağlam Penceresi: Modelin tek seferde işleyebildiği maksimum token (metin) miktarı." },
  { category: "Temel kavramlar", term: "Temperature", definition: "Sıcaklık: Modelin ürettiği metnin yaratıcılığını/rastgeleliğini kontrol eden parametre. Düşük değerler daha tutarlı, yüksek değerler daha yaratıcı sonuçlar verir." },
  { category: "Temel kavramlar", term: "Top-p", definition: "Çekirdek Örneklemesi: Sadece kümülatif olasılığı p değerine ulaşan token'ların değerlendirildiği bir filtreleme yöntemi." },
  { category: "Temel kavramlar", term: "System Prompt", definition: "Sistem İstemi: Modele nasıl davranması, hangi rolü üstlenmesi veya hangi kurallara uyması gerektiğini belirten temel talimat." },
  { category: "Temel kavramlar", term: "Few-shot", definition: "Az Örnekli Öğrenme: İstenen görevi yerine getirebilmesi için modele prompt içinde birkaç örnek verilmesi." },
  { category: "Temel kavramlar", term: "Zero-shot", definition: "Sıfır Örnekli Öğrenme: Modele herhangi bir örnek verilmeden sadece görevin tanımlanmasıyla sonucun istenmesi." },
  { category: "Temel kavramlar", term: "Hallucination", definition: "Halüsinasyon (Yanılsama): Modelin gerçekte olmayan, yanlış veya uydurma bilgileri son derece kendinden emin bir şekilde sunması." },
  { category: "Temel kavramlar", term: "Embedding", definition: "Gömme / Vektörleştirme: Kelimelerin, cümlelerin veya metinlerin matematiksel dizilere (vektörlere) dönüştürülmesi, anlamsal ilişkilerin kurulması." },
  { category: "Temel kavramlar", term: "Latency", definition: "Gecikme Süresi: Sisteme bir girdi gönderildikten sonra ilk çıktının alınmasına kadar geçen süre." },
  
  { category: "Mimari", term: "Transformer", definition: "Modern dil modellerinin temelini oluşturan, veriyi paralel olarak işleyebilen ve bağlamı çok iyi yakalayan sinir ağı mimarisi." },
  { category: "Mimari", term: "Attention", definition: "Dikkat Mekanizması: Modelin cümleyi işlerken hangi kelimelerin birbiriyle daha ilişkili olduğuna odaklanmasını sağlayan sistem." },
  { category: "Mimari", term: "Fine-tuning", definition: "İnce Ayar: Önceden eğitilmiş bir modelin, belirli bir görevi daha iyi yapması için özel bir veri setiyle yeniden eğitilmesi." },
  { category: "Mimari", term: "RAG", definition: "Geri Çağırma Artırımlı Üretim (Retrieval-Augmented Generation): Modelin kendi bilgisi dışında, harici bir veri tabanından bilgi çekerek daha doğru yanıtlar üretmesi tekniği." },
  { category: "Mimari", term: "Vector Database", definition: "Vektör Veri Tabanı: Metinlerin anlamsal vektörlerini (embedding) depolayan ve benzerlik araması yapmaya olanak tanıyan sistem." },
  { category: "Mimari", term: "Inference", definition: "Çıkarım: Eğitilmiş modelin kendisine verilen yeni bir girdiyi işleyerek yanıt üretme süreci." },
  { category: "Mimari", term: "Quantization", definition: "Nicemleme (Kuantizasyon): Modelin ağırlıklarının hassasiyetini düşürerek daha az bellek kullanmasını ve daha hızlı çalışmasını sağlayan optimizasyon işlemi." },

  { category: "Sektör jargonu", term: "Prompt Injection", definition: "İstem Enjeksiyonu: Kötü niyetli kullanıcıların modeli kandırmak veya kısıtlamalarını (guardrails) aşmak için gizli komutlar girmesi." },
  { category: "Sektör jargonu", term: "Guardrails", definition: "Korkuluklar (Güvenlik Önlemleri): Modelin zararlı, uygunsuz veya yasa dışı içerik üretmesini engelleyen güvenlik kuralları." },
  { category: "Sektör jargonu", term: "LLM-as-a-judge", definition: "Yargıç Olarak LLM: Bir dil modelinin ürettiği çıktının, başka bir dil modeli tarafından değerlendirilmesi veya puanlanması yöntemi." },
  { category: "Sektör jargonu", term: "Agentic AI", definition: "Ajan (Otonom) Yapay Zeka: Sadece metin üretmekle kalmayıp, hedeflere ulaşmak için kararlar alabilen ve eyleme geçebilen otonom sistemler." },
  { category: "Sektör jargonu", term: "Tool Use / Function Calling", definition: "Araç Kullanımı / Fonksiyon Çağırma: Modelin internet araması yapmak, kod çalıştırmak veya bir API'ye bağlanmak gibi harici araçları kullanabilme yeteneği." }
];

let data = [...defaultData];
const savedData = localStorage.getItem('aiTermsData');
if (savedData) {
    try {
        data = JSON.parse(savedData);
    } catch (e) {
        console.error("Error parsing saved data", e);
    }
}

// --- Tab Management ---
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// --- Flashcard Logic ---
let currentCards = [...data];
let currentCardIndex = 0;

const flashcardContainer = document.getElementById('flashcard');
const cardCategory = document.getElementById('card-category');
const cardTerm = document.getElementById('card-term');
const cardTermBack = document.getElementById('card-term-back');
const cardDefinition = document.getElementById('card-definition');
const cardProgress = document.getElementById('card-progress');
const cardInstruction = document.getElementById('card-instruction');
const filterSelect = document.getElementById('category-filter');
const termSearch = document.getElementById('term-search');
const practiceBanner = document.getElementById('practice-banner');
const exitPracticeBtn = document.getElementById('exit-practice-btn');

function renderCard(direction = 'none') {
    flashcardContainer.classList.remove('flipped');
    
    const updateContent = () => {
        if (currentCards.length === 0) {
            cardCategory.textContent = 'Sonuç Yok';
            cardTerm.textContent = 'Bulunamadı';
            cardTermBack.textContent = 'Bulunamadı';
            cardDefinition.textContent = 'Arama kriterlerinize uygun terim bulunamadı.';
            cardInstruction.textContent = 'Lütfen veri tabanında olan bir kelime aratın.';
            cardProgress.textContent = '0 / 0';
            return;
        }
        
        const card = currentCards[currentCardIndex];
        cardCategory.textContent = card.category;
        cardTerm.textContent = card.term;
        cardTermBack.textContent = card.term;
        cardDefinition.textContent = card.definition;
        cardInstruction.textContent = 'Çeviriyi ve açıklamayı görmek için karta tıklayın';
        cardProgress.textContent = `${currentCardIndex + 1} / ${currentCards.length}`;
    };

    if (direction === 'none') {
        setTimeout(updateContent, 150);
        return;
    }
    
    if (direction === 'fade') {
        flashcardContainer.style.animation = 'none';
        void flashcardContainer.offsetWidth; // trigger reflow
        flashcardContainer.style.animation = 'fadeIn 0.3s ease-out';
        setTimeout(updateContent, 50);
        return;
    }

    const outClass = direction === 'next' ? 'animating-next-out' : 'animating-prev-out';
    const inClass = direction === 'next' ? 'animating-next-in' : 'animating-prev-in';

    flashcardContainer.classList.remove('animating-next-out', 'animating-next-in', 'animating-prev-out', 'animating-prev-in');
    
    flashcardContainer.classList.add(outClass);
    
    setTimeout(() => {
        updateContent();
        flashcardContainer.classList.remove(outClass);
        flashcardContainer.classList.add(inClass);
        
        setTimeout(() => {
            flashcardContainer.classList.remove(inClass);
        }, 200);
    }, 200);
}

flashcardContainer.addEventListener('click', () => {
    flashcardContainer.classList.toggle('flipped');
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCard('prev');
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentCardIndex < currentCards.length - 1) {
        currentCardIndex++;
        renderCard('next');
    }
});

function applyFilters() {
    const category = filterSelect.value;
    const query = termSearch.value.toLowerCase().trim();
    
    currentCards = data.filter(item => {
        const matchesCategory = category === 'all' || item.category === category;
        const matchesSearch = item.term.toLowerCase().includes(query) || item.definition.toLowerCase().includes(query);
        return matchesCategory && matchesSearch;
    });
    
    currentCardIndex = 0;
    renderCard('fade');
}

filterSelect.addEventListener('change', applyFilters);
termSearch.addEventListener('input', applyFilters);

// --- Modal Logic ---
const addTermBtn = document.getElementById('add-term-btn');
const addTermModal = document.getElementById('add-term-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cancelTermBtn = document.getElementById('cancel-term-btn');
const saveTermBtn = document.getElementById('save-term-btn');

const newTermInput = document.getElementById('new-term');
const newCategoryInput = document.getElementById('new-category');
const newDefinitionInput = document.getElementById('new-definition');

function openModal() {
    addTermModal.classList.remove('hidden');
    newTermInput.focus();
}

function closeModal() {
    addTermModal.classList.add('hidden');
    newTermInput.value = '';
    newDefinitionInput.value = '';
    newCategoryInput.value = 'Temel kavramlar';
}

function saveNewTerm() {
    const term = newTermInput.value.trim();
    const category = newCategoryInput.value;
    const definition = newDefinitionInput.value.trim();
    
    if (!term || !definition) {
        alert("Lütfen kavram adını ve açıklamasını doldurun.");
        return;
    }
    
    const newCard = { category, term, definition };
    data.push(newCard);
    
    // Check if category exists in select, if not add it
    const existingOptions = Array.from(filterSelect.options).map(opt => opt.value);
    if (!existingOptions.includes(category)) {
        const newOption = document.createElement('option');
        newOption.value = category;
        newOption.textContent = category;
        filterSelect.appendChild(newOption);
    }
    
    // Save to localStorage
    localStorage.setItem('aiTermsData', JSON.stringify(data));
    
    closeModal();
    applyFilters(); // refresh UI
}

addTermBtn.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
cancelTermBtn.addEventListener('click', closeModal);
saveTermBtn.addEventListener('click', saveNewTerm);

// Init flashcards
// Ensure custom categories from localStorage are in select
const uniqueCategories = [...new Set(data.map(item => item.category))];
uniqueCategories.forEach(cat => {
    const existingOptions = Array.from(filterSelect.options).map(opt => opt.value);
    if (!existingOptions.includes(cat)) {
        const newOption = document.createElement('option');
        newOption.value = cat;
        newOption.textContent = cat;
        filterSelect.appendChild(newOption);
    }
});

renderCard();

// --- Quiz Logic ---
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let streakBonus = 0;
let timerInterval = null;
let penaltyInterval = null;
let penaltyPoints = 0;
let questionStartTime = 0;
let answerHistory = []; // track each answer

const quizSetup = document.getElementById('quiz-setup');
const quizActive = document.getElementById('quiz-active');
const quizResults = document.getElementById('quiz-results');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizProgress = document.getElementById('quiz-progress');
const quizScore = document.getElementById('quiz-score');
const quizTimer = document.getElementById('quiz-timer');
const timerBar = document.getElementById('timer-bar');
const quizCombo = document.getElementById('quiz-combo');
const answerFeedback = document.getElementById('answer-feedback');
const penaltyBarBg = document.getElementById('penalty-bar-bg');
const penaltyBar = document.getElementById('penalty-bar');
const penaltyText = document.getElementById('penalty-text');

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function getCleanDef(def) {
    const idx = def.indexOf(': ');
    if (idx !== -1) {
        let clean = def.substring(idx + 2).trim();
        return clean.charAt(0).toUpperCase() + clean.slice(1);
    }
    return def;
}

function generateQuestions() {
    const shuffledData = shuffleArray(data);
    const selectedData = shuffledData.slice(0, 10);
    
    quizQuestions = selectedData.map(item => {
        const askDefinition = Math.random() > 0.5;
        
        let question, correctAnswer, wrongAnswers;
        
        if (askDefinition) {
            question = `Aşağıdakilerden hangisi "${item.term}" kavramının açıklamasıdır?`;
            correctAnswer = getCleanDef(item.definition);
            wrongAnswers = shuffleArray(data.filter(d => d.term !== item.term)).slice(0, 3).map(d => getCleanDef(d.definition));
        } else {
            question = `"${getCleanDef(item.definition)}"\n\nYukarıdaki açıklama hangi kavrama aittir?`;
            correctAnswer = item.term;
            wrongAnswers = shuffleArray(data.filter(d => d.term !== item.term)).slice(0, 3).map(d => d.term);
        }
        
        const options = shuffleArray([correctAnswer, ...wrongAnswers]);
        
        return {
            term: item.term,
            question,
            options,
            correctAnswer
        };
    });
}

function startQuiz() {
    score = 0;
    streakBonus = 0;
    currentQuestionIndex = 0;
    answerHistory = [];
    generateQuestions();
    
    quizSetup.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizActive.classList.remove('hidden');
    
    renderQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    clearInterval(penaltyInterval);
    penaltyPoints = 0;
    questionStartTime = Date.now();
    
    const updateTimer = () => {
        const elapsed = (Date.now() - questionStartTime) / 1000;
        const timeLeft = Math.max(10 - elapsed, 0);
        quizTimer.textContent = `${timeLeft.toFixed(1)}s`;
        
        const widthPercentage = (timeLeft / 10) * 100;
        timerBar.style.width = `${widthPercentage}%`;
        
        if (timeLeft <= 3 && timeLeft > 0) {
            timerBar.classList.add('warning');
        } else {
            timerBar.classList.remove('warning');
        }
        
        if (timeLeft <= 0) {
            quizTimer.textContent = `0.0s`;
            timerBar.style.width = `0%`;
            timerBar.classList.remove('warning');
            clearInterval(timerInterval);
            startPenaltyTimer();
        }
    };
    
    updateTimer();
    timerInterval = setInterval(updateTimer, 100);
}

function startPenaltyTimer() {
    streakBonus = 0;
    quizCombo.classList.add('hidden');
    penaltyBarBg.classList.remove('hidden');
    penaltyBar.style.width = '0%';
    penaltyPoints = 0;
    penaltyText.textContent = '-0';
    
    const penaltyStartTime = Date.now();
    const maxPenaltySeconds = 10;
    
    penaltyInterval = setInterval(() => {
        const penaltyElapsed = (Date.now() - penaltyStartTime) / 1000;
        penaltyPoints = Math.floor(penaltyElapsed);
        
        const penaltyWidth = Math.min((penaltyElapsed / maxPenaltySeconds) * 100, 100);
        penaltyBar.style.width = `${penaltyWidth}%`;
        penaltyText.textContent = `-${penaltyPoints}`;
        
        // Auto-fail at -10
        if (penaltyPoints >= 10) {
            clearInterval(penaltyInterval);
            clearInterval(timerInterval);
            penaltyText.textContent = `-10`;
            penaltyBar.style.width = '100%';
            
            // Record this question as timeout
            const q = quizQuestions[currentQuestionIndex];
            answerHistory.push({
                term: q.term,
                correct: false,
                timeTaken: 20,
                points: -10,
                bonus: 0,
                reason: 'timeout'
            });
            score -= 10;
            
            autoFailQuiz();
        }
    }, 100);
}

function autoFailQuiz() {
    clearInterval(timerInterval);
    clearInterval(penaltyInterval);
    
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    const resultsTitle = document.getElementById('results-title');
    resultsTitle.textContent = 'Test Başarısız!';
    
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.classList.add('fail');
    document.getElementById('final-score').textContent = `${score}`;
    
    document.getElementById('feedback-text').textContent = 'Ceza süresi -10\'a ulaştı. Daha fazla çalışmanız gerekiyor!';
    
    renderResultsDetails();
    
    // Auto-redirect to flashcards after showing results
    const practiceBtn = document.getElementById('practice-wrong-btn');
    practiceBtn.classList.remove('hidden');
    practiceBtn.textContent = 'Çalışma Kartlarına Dön';
    practiceBtn.onclick = () => {
        switchToFlashcards();
    };
}

function switchToFlashcards(wrongTerms = null) {
    // Reset quiz UI
    quizResults.classList.add('hidden');
    quizSetup.classList.remove('hidden');
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.classList.remove('fail');
    
    // Switch tabs
    tabs.forEach(t => t.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('active'));
    document.querySelector('[data-tab="flashcards"]').classList.add('active');
    document.getElementById('flashcards').classList.add('active');
    
    // If wrong terms provided, filter flashcards to those
    if (wrongTerms && wrongTerms.length > 0) {
        currentCards = data.filter(d => wrongTerms.includes(d.term));
        filterSelect.value = 'all';
        filterSelect.disabled = true;
        termSearch.value = '';
        termSearch.disabled = true;
        practiceBanner.classList.remove('hidden');
        currentCardIndex = 0;
        renderCard();
    }
}

if (exitPracticeBtn) {
    exitPracticeBtn.addEventListener('click', () => {
        practiceBanner.classList.add('hidden');
        filterSelect.disabled = false;
        filterSelect.value = 'all';
        termSearch.disabled = false;
        termSearch.value = '';
        applyFilters();
    });
}

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    
    quizProgress.textContent = `Soru: ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    quizScore.textContent = `Puan: ${score}`;
    questionText.textContent = q.question;
    
    // Reset feedback & penalty bar
    answerFeedback.classList.add('hidden');
    answerFeedback.className = 'answer-feedback hidden';
    penaltyBarBg.classList.add('hidden');
    penaltyBar.style.width = '0%';
    
    // Update combo UI
    if (streakBonus > 0) {
        quizCombo.textContent = `+${streakBonus} Bonus Aktif!`;
        quizCombo.classList.remove('hidden');
    } else {
        quizCombo.classList.add('hidden');
    }
    
    startTimer();
    
    optionsContainer.innerHTML = '';
    
    q.options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option;
        btn.addEventListener('click', () => selectOption(btn, option, q.correctAnswer));
        optionsContainer.appendChild(btn);
    });
}

function showFeedback(text, type) {
    answerFeedback.textContent = text;
    answerFeedback.className = `answer-feedback ${type}`;
    answerFeedback.classList.remove('hidden');
}

function selectOption(selectedBtn, selectedAnswer, correctAnswer) {
    clearInterval(timerInterval);
    clearInterval(penaltyInterval);
    const allOptions = optionsContainer.querySelectorAll('.option-btn');
    
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    let pointsEarned = 0;
    let bonusEarned = 0;
    const q = quizQuestions[currentQuestionIndex];
    
    if (selectedAnswer === correctAnswer) {
        if (timeTaken <= 10) {
            streakBonus += 5;
            bonusEarned = streakBonus;
            pointsEarned = 10 + streakBonus;
            showFeedback(`Harika! +${pointsEarned} Puan (${timeTaken.toFixed(1)}s)`, 'success');
            
            const appContainer = document.querySelector('.app-container');
            appContainer.classList.add('shake-effect');
            setTimeout(() => {
                appContainer.classList.remove('shake-effect');
            }, 400);
        } else {
            streakBonus = 0;
            quizCombo.classList.add('hidden');
            pointsEarned = 5 - penaltyPoints;
            if (pointsEarned > 0) {
                showFeedback(`Doğru! +${pointsEarned} Puan (Süre doldu, -${penaltyPoints} ceza)`, 'success');
            } else {
                showFeedback(`Doğru ama çok geç! ${pointsEarned} Puan (-${penaltyPoints} ceza)`, 'error');
            }
        }
        score += pointsEarned;
        
        answerHistory.push({
            term: q.term,
            correct: true,
            timeTaken: timeTaken,
            points: pointsEarned,
            bonus: bonusEarned
        });
    } else {
        streakBonus = 0;
        quizCombo.classList.add('hidden');
        pointsEarned = -5;
        score += pointsEarned;
        selectedBtn.classList.add('wrong');
        showFeedback(`Yanlış Cevap! ${pointsEarned} Puan (Seri bozuldu)`, 'error');
        
        answerHistory.push({
            term: q.term,
            correct: false,
            timeTaken: timeTaken,
            points: pointsEarned,
            bonus: 0
        });
    }
    
    quizScore.textContent = `Puan: ${score}`;
    
    // Disable all options and show correct/wrong
    allOptions.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        }
    });
    
    // Auto-advance after 1.2s
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < quizQuestions.length) {
            renderQuestion();
        } else {
            finishQuiz();
        }
    }, 1200);
}

function renderResultsDetails() {
    const correctList = document.getElementById('correct-list');
    const wrongList = document.getElementById('wrong-list');
    correctList.innerHTML = '';
    wrongList.innerHTML = '';
    
    const correctAnswers = answerHistory.filter(a => a.correct);
    const wrongAnswers = answerHistory.filter(a => !a.correct);
    
    if (correctAnswers.length === 0) {
        correctList.innerHTML = '<p style="font-size:0.85rem;color:#6B7280;padding:0.5rem 0;">Doğru cevap yok.</p>';
    } else {
        correctAnswers.forEach(a => {
            const item = document.createElement('div');
            item.className = 'result-item correct-item';
            const bonusText = a.bonus > 0 ? ` (+${a.bonus} bonus)` : '';
            item.innerHTML = `
                <span class="term-name">${a.term}</span>
                <span class="result-meta">${a.timeTaken.toFixed(1)}s · +${a.points} puan${bonusText}</span>
            `;
            correctList.appendChild(item);
        });
    }
    
    if (wrongAnswers.length === 0) {
        wrongList.innerHTML = '<p style="font-size:0.85rem;color:#6B7280;padding:0.5rem 0;">Yanlış cevap yok. Tebrikler!</p>';
    } else {
        wrongAnswers.forEach(a => {
            const item = document.createElement('div');
            item.className = 'result-item wrong-item';
            const reason = a.reason === 'timeout' ? 'Süre doldu' : `${a.timeTaken.toFixed(1)}s`;
            item.innerHTML = `
                <span class="term-name">${a.term}</span>
                <span class="result-meta">${reason} · ${a.points} puan</span>
            `;
            wrongList.appendChild(item);
        });
    }
    
    // Practice wrong answers button
    const practiceBtn = document.getElementById('practice-wrong-btn');
    if (wrongAnswers.length > 0) {
        practiceBtn.classList.remove('hidden');
        practiceBtn.textContent = `Yanlışları Çalış (${wrongAnswers.length} kavram)`;
        practiceBtn.onclick = () => {
            const wrongTerms = wrongAnswers.map(a => a.term);
            switchToFlashcards(wrongTerms);
        };
    } else {
        practiceBtn.classList.add('hidden');
    }
}

function finishQuiz() {
    clearInterval(timerInterval);
    clearInterval(penaltyInterval);
    
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    const resultsTitle = document.getElementById('results-title');
    resultsTitle.textContent = 'Test Tamamlandı!';
    
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.classList.remove('fail');
    document.getElementById('final-score').textContent = `${score}`;
    
    const feedback = document.getElementById('feedback-text');
    if (score >= 150) feedback.textContent = "Mükemmel! Süper hızlı ve hatasızsınız!";
    else if (score >= 100) feedback.textContent = "Harika! Çoğu soruyu hızlıca bildiniz.";
    else if (score >= 50) feedback.textContent = "İyi deneme, seri bonuslarını yakalamak için biraz daha hızlanabilirsiniz.";
    else feedback.textContent = "Daha fazla pratik yapmanız gerekiyor.";
    
    renderResultsDetails();
}

document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
document.getElementById('restart-quiz-btn').addEventListener('click', startQuiz);

