// Вставьте сюда URL вашего развернутого Google Apps Script
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyUVwrX3sXSYjDhZgmjYzUXsup7GUvgzPQVDAZGQK10El6P5voRZ5joUkcGjjCzJukW8A/exec';

const questions = [
    {
        text: "Как переводится «алма»?",
        options: ["Груша", "Яблоко", "Абрикос", "Персик"],
        correct: 1
    },
    {
        text: "Что означает слово «жүзүм»?",
        options: ["Клубника", "Смородина", "Виноград", "Арбуз"],
        correct: 2
    },
    {
        text: "Как по-кыргызски будет «клубника»?",
        options: ["Карагат", "Кулпунай", "Өрүк", "Шабдалы"],
        correct: 1
    },
    {
        text: "Какой перевод у слова «дарбыз»?",
        options: ["Дыня", "Арбуз", "Слива", "Вишня"],
        correct: 1
    },
    {
        text: "Что означает «коон»?",
        options: ["Арбуз", "Дыня", "Груша", "Абрикос"],
        correct: 1
    },
    {
        text: "Как переводится «алмурут»?",
        options: ["Груша", "Яблоко", "Персик", "Абрикос"],
        correct: 0
    },
    {
        text: "Какое слово означает «смородина»?",
        options: ["Кулпунай", "Карагат", "Жүзүм", "Өрүк"],
        correct: 1
    },
    {
        text: "Что означает слово «өрүк»?",
        options: ["Персик", "Абрикос", "Слива", "Вишня"],
        correct: 1
    },
    {
        text: "Как по-кыргызски «персик»?",
        options: ["Шабдалы", "Өрүк", "Алма", "Алмурут"],
        correct: 0
    },
    {
        text: "Слово «жемиш» в кыргызском языке может означать...",
        options: ["Только фрукты", "Только ягоды", "И фрукты, и ягоды", "Только овощи"],
        correct: 2
    }
];

// Рендер вопросов
const form = document.getElementById('quizForm');
questions.forEach((q, index) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
        <div class="question-text">${index + 1}. ${q.text}</div>
        <div class="options">
            ${q.options.map((opt, i) => `
                <label>
                    <input type="radio" name="q${index}" value="${i}" required>
                    ${opt}
                </label>
            `).join('')}
        </div>
    `;
    form.appendChild(card);
});

// Добавляем кнопку отправки
const submitBtn = document.createElement('button');
submitBtn.type = 'submit';
submitBtn.textContent = 'Завершить тест';
form.appendChild(submitBtn);

// Обработка отправки
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';

    let score = 0;
    const answers = {};

    questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        const answerIndex = selected ? parseInt(selected.value) : -1;
        answers[`q${index + 1}`] = answerIndex;
        if (answerIndex === q.correct) {
            score++;
        }
    });

    // Показываем результат
    document.getElementById('score').textContent = score;
    document.getElementById('result').classList.remove('hidden');
    form.style.display = 'none';

    // Отправка в Google Sheets
    const formData = new FormData();
    formData.append('timestamp', new Date().toISOString());
    formData.append('score', score);
    formData.append('total', questions.length);
    
    // Добавляем ответы
    for (let i = 1; i <= 10; i++) {
        formData.append(`q${i}`, answers[`q${i}`] ?? '');
    }

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors' // Важно для обхода CORS при работе с Apps Script
        });
        console.log('Данные отправлены');
    } catch (error) {
        console.error('Ошибка отправки:', error);
    }
});
