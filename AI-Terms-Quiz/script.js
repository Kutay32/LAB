const data = [
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
const filterSelect = document.getElementById('category-filter');

function renderCard(direction = 'none') {
    if (currentCards.length === 0) return;
    
    flashcardContainer.classList.remove('flipped');
    
    const updateContent = () => {
        const card = currentCards[currentCardIndex];
        cardCategory.textContent = card.category;
        cardTerm.textContent = card.term;
        cardTermBack.textContent = card.term;
        cardDefinition.textContent = card.definition;
        cardProgress.textContent = `${currentCardIndex + 1} / ${currentCards.length}`;
    };

    if (direction === 'none') {
        setTimeout(updateContent, 150);
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

filterSelect.addEventListener('change', (e) => {
    const category = e.target.value;
    if (category === 'all') {
        currentCards = [...data];
    } else {
        currentCards = data.filter(item => item.category === category);
    }
    currentCardIndex = 0;
    renderCard();
});

// Init flashcards
renderCard();

// --- Quiz Logic ---
let quizQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let streakBonus = 0;
let timerInterval = null;
let questionStartTime = 0;

const quizSetup = document.getElementById('quiz-setup');
const quizActive = document.getElementById('quiz-active');
const quizResults = document.getElementById('quiz-results');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizProgress = document.getElementById('quiz-progress');
const quizScore = document.getElementById('quiz-score');
const nextQuestionBtn = document.getElementById('next-question-btn');
const quizTimer = document.getElementById('quiz-timer');
const timerBar = document.getElementById('timer-bar');
const quizCombo = document.getElementById('quiz-combo');
const answerFeedback = document.getElementById('answer-feedback');

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function generateQuestions() {
    // 10 random questions
    const shuffledData = shuffleArray(data);
    const selectedData = shuffledData.slice(0, 10);
    
    quizQuestions = selectedData.map(item => {
        // Randomly choose between "Ask definition given term" or "Ask term given definition"
        const askDefinition = Math.random() > 0.5;
        
        const getCleanDef = (def) => {
            const idx = def.indexOf(': ');
            if (idx !== -1) {
                let clean = def.substring(idx + 2).trim();
                return clean.charAt(0).toUpperCase() + clean.slice(1);
            }
            return def;
        };
        
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
    generateQuestions();
    
    quizSetup.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizActive.classList.remove('hidden');
    
    renderQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
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
        }
    };
    
    updateTimer();
    timerInterval = setInterval(updateTimer, 100);
}

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    
    quizProgress.textContent = `Soru: ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    quizScore.textContent = `Puan: ${score}`;
    questionText.textContent = q.question;
    
    // Reset feedback
    answerFeedback.classList.add('hidden');
    answerFeedback.className = 'answer-feedback hidden';
    
    // Update combo UI
    if (streakBonus > 0) {
        quizCombo.textContent = `🔥 +${streakBonus} Bonus Aktif!`;
        quizCombo.classList.remove('hidden');
    } else {
        quizCombo.classList.add('hidden');
    }
    
    startTimer();
    
    optionsContainer.innerHTML = '';
    nextQuestionBtn.classList.add('hidden');
    
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
    const allOptions = optionsContainer.querySelectorAll('.option-btn');
    
    // Calculate points
    const timeTaken = (Date.now() - questionStartTime) / 1000;
    let pointsEarned = 0;
    
    if (selectedAnswer === correctAnswer) {
        if (timeTaken <= 10) {
            streakBonus += 5;
            pointsEarned = 10 + streakBonus;
            showFeedback(`Harika! +${pointsEarned} Puan (${timeTaken.toFixed(1)}s)`, 'success');
        } else {
            streakBonus = 0;
            quizCombo.classList.add('hidden');
            pointsEarned = 5;
            showFeedback(`Doğru! +5 Puan (Süre dolduğu için daha az puan)`, 'success');
        }
        score += pointsEarned;
    } else {
        streakBonus = 0;
        quizCombo.classList.add('hidden');
        pointsEarned = -5; // Penalty
        score += pointsEarned;
        selectedBtn.classList.add('wrong');
        showFeedback(`Yanlış Cevap! ${pointsEarned} Puan (Seri bozuldu)`, 'error');
    }
    
    quizScore.textContent = `Puan: ${score}`;
    
    // Disable all options and show correct/wrong
    allOptions.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        }
    });
    
    nextQuestionBtn.classList.remove('hidden');
}

function finishQuiz() {
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    document.getElementById('final-score').textContent = `${score} Puan`;
    
    const feedback = document.getElementById('feedback-text');
    if (score >= 150) feedback.textContent = "Mükemmel! Süper hızlı ve hatasızsınız!";
    else if (score >= 100) feedback.textContent = "Harika! Çoğu soruyu hızlıca bildiniz.";
    else if (score >= 50) feedback.textContent = "İyi deneme, ancak seri bonuslarını yakalamak için biraz daha hızlanabilirsiniz.";
    else feedback.textContent = "Daha fazla pratik yapmanız gerekiyor.";
}

document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
document.getElementById('restart-quiz-btn').addEventListener('click', startQuiz);
nextQuestionBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        renderQuestion();
    } else {
        finishQuiz();
    }
});
