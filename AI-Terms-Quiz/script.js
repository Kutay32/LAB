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

function renderCard() {
    if (currentCards.length === 0) return;
    
    // Reset flip state before changing content
    flashcardContainer.classList.remove('flipped');
    
    setTimeout(() => {
        const card = currentCards[currentCardIndex];
        cardCategory.textContent = card.category;
        cardTerm.textContent = card.term;
        cardTermBack.textContent = card.term;
        cardDefinition.textContent = card.definition;
        cardProgress.textContent = `${currentCardIndex + 1} / ${currentCards.length}`;
    }, 150); // slight delay to allow flip animation to reset
}

flashcardContainer.addEventListener('click', () => {
    flashcardContainer.classList.toggle('flipped');
});

document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCard();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentCardIndex < currentCards.length - 1) {
        currentCardIndex++;
        renderCard();
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

const quizSetup = document.getElementById('quiz-setup');
const quizActive = document.getElementById('quiz-active');
const quizResults = document.getElementById('quiz-results');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const quizProgress = document.getElementById('quiz-progress');
const quizScore = document.getElementById('quiz-score');
const nextQuestionBtn = document.getElementById('next-question-btn');

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
        
        let question, correctAnswer, wrongAnswers;
        
        if (askDefinition) {
            question = `Aşağıdakilerden hangisi "${item.term}" kavramının açıklamasıdır?`;
            correctAnswer = item.definition;
            wrongAnswers = shuffleArray(data.filter(d => d.term !== item.term)).slice(0, 3).map(d => d.definition);
        } else {
            question = `"${item.definition}"\n\nYukarıdaki açıklama hangi kavrama aittir?`;
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
    currentQuestionIndex = 0;
    generateQuestions();
    
    quizSetup.classList.add('hidden');
    quizResults.classList.add('hidden');
    quizActive.classList.remove('hidden');
    
    renderQuestion();
}

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    
    quizProgress.textContent = `Soru: ${currentQuestionIndex + 1}/${quizQuestions.length}`;
    quizScore.textContent = `Puan: ${score}`;
    questionText.textContent = q.question;
    
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

function selectOption(selectedBtn, selectedAnswer, correctAnswer) {
    const allOptions = optionsContainer.querySelectorAll('.option-btn');
    
    // Disable all options and show correct/wrong
    allOptions.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        }
    });
    
    if (selectedAnswer === correctAnswer) {
        score++;
        quizScore.textContent = `Puan: ${score}`;
    } else {
        selectedBtn.classList.add('wrong');
    }
    
    nextQuestionBtn.classList.remove('hidden');
}

function finishQuiz() {
    quizActive.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    document.getElementById('final-score').textContent = `${score}/${quizQuestions.length}`;
    
    const feedback = document.getElementById('feedback-text');
    if (score === 10) feedback.textContent = "Mükemmel! Yapay zeka terimlerine tamamen hakimsiniz.";
    else if (score >= 7) feedback.textContent = "Harika! Kavramların çoğunu öğrenmişsiniz.";
    else if (score >= 4) feedback.textContent = "İyi deneme, ancak biraz daha çalışma kartlarına göz atabilirsiniz.";
    else feedback.textContent = "Daha fazla pratik yapmanız gerekiyor, çalışma kartlarını tekrar edin.";
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
