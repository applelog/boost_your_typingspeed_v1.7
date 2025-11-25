// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const typingScreen = document.getElementById('typing-screen');
const startButton = document.getElementById('start-button');
const modeButtons = document.querySelectorAll('.mode-button');
const levelSelection = document.getElementById('level-selection');
const levelButtons = document.querySelectorAll('.level-button');
const howToPlayButton = document.getElementById('how-to-play-button');
const infoModal = document.getElementById('info-modal');
const closeInfoModalButton = document.getElementById('close-info-modal-button');
const resultModal = document.getElementById('result-modal');
const closeResultModalButton = document.getElementById('close-result-modal-button');
const resultTitle = document.getElementById('result-title');
const testResultStats = document.getElementById('test-result-stats');
const gameResultMessage = document.getElementById('game-result-message');
const finalWpmElement = document.getElementById('final-wpm');
const finalLevelElement = document.getElementById('final-level');
const finalMistakesElement = document.getElementById('final-mistakes');
const patchNotesButton = document.getElementById('patch-notes-button');
const patchNotesModal = document.getElementById('patch-notes-modal');
const closePatchNotesButton = document.getElementById('close-patch-notes-button');

const langTabButtons = document.querySelectorAll('.lang-tab-button');
const patchNotesKO = document.getElementById('patch-notes-ko');
const patchNotesEN = document.getElementById('patch-notes-en');

const quoteDisplayElement = document.getElementById('quote-display');
const alphabetDisplayElement = document.getElementById('alphabet-display');
const quoteInputElement = document.getElementById('quote-input');

// Stats Elements
const timerStatElement = document.getElementById('timer-stat');
const wpmStatElement = document.getElementById('wpm-stat');
const accuracyStatElement = document.getElementById('accuracy-stat');
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');

const backToMenuButton = document.getElementById('back-to-menu-button');
const restartButton = document.getElementById('restart-button');
const newSentenceButton = document.getElementById('new-sentence-button');
const keyboardElement = document.getElementById('keyboard');
const feedbackMessageElement = document.getElementById('feedback-message');
const gameContainer = document.getElementById('game-container');
const playerCar = document.getElementById('player-car');
const aiCar = document.getElementById('ai-car');


// --- Text Resources ---
const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
const practiceQuotes = [
    "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    "The way to get started is to quit talking and begin doing.",
    "Your time is limited, so don't waste it living someone else's life.",
    "If life were predictable it would cease to be life, and be without flavor.",
    "The future belongs to those who believe in the beauty of their dreams.",
    "It is during our darkest moments that we must focus to see the light.",
    "Whoever is happy will make others happy too.",
    "Do not go where the path may lead, go instead where there is no path and leave a trail.",
    "You will face many defeats in life, but never let yourself be defeated.",
    "Life is what happens when you're busy making other plans.",
    "The purpose of our lives is to be happy.",
    "Never let the fear of striking out keep you from playing the game."
];
const testQuotes = ["The quick brown fox jumps over the lazy dog. This sentence is famous because it contains all of the letters of the English alphabet. It is often used for touch-typing practice and keyboard testing.", "Technology has revolutionized the way we live and work. From smartphones to artificial intelligence, these advancements continue to shape our daily lives, offering convenience and new possibilities.", "Climate change is one of the most pressing issues of our time. It requires a global effort to reduce carbon emissions and transition to sustainable energy sources to protect our planet for future generations.", "Learning a new language opens up a world of opportunities. It not only allows you to communicate with more people but also provides insights into different cultures and ways of thinking, enriching your life."];

const easyGameWords = [
    'time', 'work', 'city', 'team', 'plan', 'hope', 'food', 'road', 'tree', 'book', 'home', 'water', 'music', 
    'power', 'light', 'sound', 'color', 'shape', 'love', 'life', 'art', 'sun', 'sky', 'car', 'key', 'pen', 
    'box', 'dog', 'cat', 'map', 'job', 'day', 'end'
];
const normalGameWords = [
    'people', 'world', 'school', 'friend', 'future', 'spirit', 'system', 'project', 'design', 'create', 
    'learn', 'study', 'answer', 'number', 'letter', 'planet', 'rocket', 'mission', 'explore', 'artist', 
    'family', 'nature', 'health', 'energy'
];
const hardGameWords = [
    'challenge', 'keyboard', 'developer', 'language', 'adventure', 'technology', 'universe', 'inspiration', 
    'knowledge', 'happiness', 'symphony', 'experience', 'celebrate', 'question', 'solution', 'beautiful', 
    'computer', 'internet', 'creative'
];
let currentText = '';

// --- State ---
let timer;
let startTime;
let currentMode = 'practice';
let currentLevel = 'easy';
const TEST_TIME = 60;
let testEnded = false;
let isTransitioning = false;
let shuffledAlphabet = [];
let alphabetIndex = 0;
let alphabetTypedCount = 0;

// --- Game State ---
const WORDS_PER_GAME = 20;
let playerPos = 0, aiPos = 0, aiTimer, gameEnded = false, currentWordIndex = 0, shuffledGameWords = [];

// --- Event Listeners ---
startButton.addEventListener('click', startTyping);
backToMenuButton.addEventListener('click', backToMenu);
restartButton.addEventListener('click', restartCurrentSentence);
newSentenceButton.addEventListener('click', () => renderNewText(true));

modeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modeButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentMode = button.dataset.mode;
        if (currentMode === 'game') {
            levelSelection.classList.remove('hidden');
        } else {
            levelSelection.classList.add('hidden');
        }
    });
});
levelButtons.forEach(button => {
    button.addEventListener('click', () => {
        levelButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentLevel = button.dataset.level;
    });
});

howToPlayButton.addEventListener('click', () => infoModal.classList.remove('hidden'));
closeInfoModalButton.addEventListener('click', () => infoModal.classList.add('hidden'));
closeResultModalButton.addEventListener('click', () => { resultModal.classList.add('hidden'); backToMenu(); });
patchNotesButton.addEventListener('click', () => patchNotesModal.classList.remove('hidden'));
closePatchNotesButton.addEventListener('click', () => patchNotesModal.classList.add('hidden'));

langTabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const lang = button.dataset.lang;

        langTabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        patchNotesKO.classList.add('hidden');
        patchNotesEN.classList.add('hidden');

        if (lang === 'ko') {
            patchNotesKO.classList.remove('hidden');
        } else {
            patchNotesEN.classList.remove('hidden');
        }
    });
});

quoteInputElement.addEventListener('input', handleInput);
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// --- Utility Functions ---
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
function showFeedback(message) {
    feedbackMessageElement.textContent = message;
    feedbackMessageElement.classList.add('show');
    setTimeout(() => { feedbackMessageElement.classList.remove('show'); }, 1500);
}

// --- Main Functions ---
function startTyping() {
    startScreen.classList.add('hidden');
    typingScreen.classList.remove('hidden');
    quoteInputElement.disabled = false;
    testEnded = false;
    setupUIForMode();

    if (currentMode === 'game') {
        startGame();
    } else {
        renderNewText();
    }
    quoteInputElement.focus();
}

function backToMenu() {
    typingScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    quoteInputElement.disabled = true;
    clearInterval(timer);
    clearInterval(aiTimer);
}

function handleInput() {
    if (isTransitioning || (currentMode === 'test' && testEnded) || (currentMode === 'game' && gameEnded)) return;

    if (currentMode === 'alphabet') {
        const typedChar = quoteInputElement.value;
        if (!typedChar) return;
        const currentTargetChar = shuffledAlphabet[alphabetIndex];
        const charBox = document.querySelector('.current-char-box');
        if (typedChar.toLowerCase() === currentTargetChar) {
            alphabetTypedCount++;
            wpmElement.innerText = alphabetTypedCount;
            alphabetIndex++;
            if (alphabetIndex >= shuffledAlphabet.length) {
                alphabetIndex = 0;
                shuffledAlphabet = shuffleArray(alphabet);
            }
            const track = document.querySelector('.alphabet-char-track');
            track.classList.add('fading-out');
            setTimeout(() => { renderAlphabetUI(); track.classList.remove('fading-out'); }, 200);
        } else {
            charBox.classList.add('incorrect-flash');
            setTimeout(() => charBox.classList.remove('incorrect-flash'), 200);
        }
        quoteInputElement.value = "";
        return;
    }

    if (!startTime && currentMode !== 'game') startTimer();

    // [버그 수정] .word 컨테이너만 제외하고 실제 문자 span 선택 (스페이스 포함)
    const allCharSpans = Array.from(quoteDisplayElement.querySelectorAll('span')).filter(span => 
        !span.classList.contains('word')
    );
    const typedValue = quoteInputElement.value;
    const arrayValue = typedValue.split('');
    const oldCurrentSpan = quoteDisplayElement.querySelector('span.current');
    if (oldCurrentSpan) oldCurrentSpan.classList.remove('current');

    allCharSpans.forEach((charSpan, index) => {
        const char = arrayValue[index];
        const originalChar = charSpan.innerHTML === '&nbsp;' ? ' ' : charSpan.innerText;
        charSpan.classList.remove('correct', 'incorrect');
        if (char == null) {} 
        else if (char === originalChar) charSpan.classList.add('correct');
        else charSpan.classList.add('incorrect');
    });

    if (arrayValue.length < allCharSpans.length) {
        allCharSpans[arrayValue.length].classList.add('current');
    }

    updateKeyboardHighlight();
    
    if (currentMode !== 'game') {
        updateStats();
    }

    if (currentMode === 'game') {
        const targetWord = shuffledGameWords[currentWordIndex];
        const incorrectChars = Array.from(quoteDisplayElement.querySelectorAll('span')).filter(span => 
            !span.classList.contains('word') && span.classList.contains('incorrect')
        ).length;

        if (typedValue.length === targetWord.length && incorrectChars === 0) {
            playerPos++;
            const trackWidth = gameContainer.offsetWidth;
            const carWidth = playerCar.offsetWidth;
            const moveDistance = (trackWidth - carWidth - 40) / WORDS_PER_GAME;
            playerCar.style.left = `${10 + playerPos * moveDistance}px`;
            
            currentWordIndex++;
            quoteInputElement.value = '';

            if (playerPos >= WORDS_PER_GAME) {
                endGame(true);
            } else {
                isTransitioning = true;
                setTimeout(() => {
                    displayNextGameWord();
                    isTransitioning = false;
                    quoteInputElement.focus();
                }, 200);
            }
        }
    } 
    else if (currentMode === 'test' && typedValue.length === currentText.length) {
        endTest();
    }
}

function startTimer() {
    startTime = new Date();
    if (currentMode === 'alphabet') timerElement.innerText = '0s';
    else timerElement.innerText = currentMode === 'test' ? `${TEST_TIME}s` : '0s';
    
    timer = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        if (currentMode === 'test') {
            const remainingTime = TEST_TIME - elapsedTime;
            timerElement.innerText = `${remainingTime}s`;
            if (remainingTime <= 0) endTest();
        } else {
            timerElement.innerText = `${elapsedTime}s`;
        }
        if (currentMode !== 'alphabet' && currentMode !== 'game') updateStats();
    }, 1000);
}

function endTest() {
    if (testEnded) return;
    testEnded = true;
    clearInterval(timer);
    quoteInputElement.disabled = true;
    const { wpm, mistakes } = calculateStats();
    finalWpmElement.innerText = wpm;
    finalMistakesElement.innerText = mistakes;
    finalLevelElement.innerText = getTypingLevel(wpm);
    resultTitle.innerText = 'Test Complete!';
    testResultStats.classList.remove('hidden');
    gameResultMessage.classList.add('hidden');
    resultModal.classList.remove('hidden');
}

function calculateStats() {
    const elapsedTimeInSeconds = startTime ? (new Date() - startTime) / 1000 : 0;
    if (elapsedTimeInSeconds === 0) return { wpm: 0, accuracy: 100, mistakes: 0 };
    const typedValue = quoteInputElement.value;
    const typedLength = typedValue.length;
    let correctChars = 0;
    
    // [버그 수정] .word 컨테이너만 제외하고 실제 문자 span 선택 (스페이스 포함)
    const allCharSpans = Array.from(quoteDisplayElement.querySelectorAll('span')).filter(span => 
        !span.classList.contains('word')
    );
    
    allCharSpans.forEach((span, index) => {
        if (index < typedLength && span.classList.contains('correct')) { correctChars++; }
    });
    const accuracy = typedLength > 0 ? Math.round((correctChars / typedLength) * 100) : 100;
    const wpm = Math.round((typedLength / 5) / (elapsedTimeInSeconds / 60));
    const mistakes = typedLength - correctChars;
    return { wpm, accuracy, mistakes };
}

function updateStats() {
    const { wpm, accuracy } = calculateStats();
    wpmElement.innerText = wpm;
    accuracyElement.innerText = `${accuracy}%`;
    if (wpm < 40) wpmElement.style.color = '#F44336';
    else if (wpm >= 40 && wpm < 70) wpmElement.style.color = '#333';
    else wpmElement.style.color = '#4CAF50';
}

function getTypingLevel(wpm) {
    if (wpm < 40) return "Beginner";
    if (wpm < 70) return "Intermediate";
    if (wpm < 90) return "Proficient";
    return "Expert";
}

function setupUIForMode() {
    if (currentMode === 'game') {
        newSentenceButton.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        document.querySelector('.result').style.visibility = 'hidden';
    } else {
        newSentenceButton.classList.remove('hidden');
        gameContainer.classList.add('hidden');
        document.querySelector('.result').style.visibility = 'visible';
    }

    if (currentMode === 'alphabet') {
        wpmStatElement.querySelector('.label').innerText = 'Typed';
        wpmElement.innerText = '0';
        accuracyStatElement.classList.add('hidden');
        wpmStatElement.classList.remove('hidden');
    } else {
        wpmStatElement.querySelector('.label').innerText = 'WPM';
        wpmElement.innerText = '0';
        accuracyStatElement.classList.remove('hidden');
        wpmStatElement.classList.remove('hidden');
    }
}

function renderNewText(forceNew = false) {
    clearInterval(timer);
    startTime = null;
    quoteInputElement.value = null;
    isTransitioning = false;
    
    if (currentMode === 'alphabet') {
        alphabetTypedCount = 0;
        quoteDisplayElement.classList.add('hidden');
        alphabetDisplayElement.classList.remove('hidden');
        shuffledAlphabet = shuffleArray(alphabet);
        alphabetIndex = 0;
        renderAlphabetUI();
        startTimer();
    } else {
        timerElement.innerText = currentMode === 'test' ? `${TEST_TIME}s` : '0s';
        wpmElement.innerText = '0';
        accuracyElement.innerText = '100%';
        wpmElement.style.color = '#333';
        quoteDisplayElement.classList.remove('hidden');
        alphabetDisplayElement.classList.add('hidden');
        
        if (currentMode === 'practice') {
            currentText = practiceQuotes[Math.floor(Math.random() * practiceQuotes.length)];
        } else {
            currentText = testQuotes[Math.floor(Math.random() * testQuotes.length)];
        }
        
        // [버그 수정] 단어 단위로 줄바꿈되도록 단어별로 그룹화, 스페이스는 일반 span으로 처리
        quoteDisplayElement.innerHTML = '';
        const words = currentText.split(' ');
        words.forEach((word, wordIndex) => {
            const wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            
            word.split('').forEach(char => {
                const charSpan = document.createElement('span');
                charSpan.innerText = char;
                wordSpan.appendChild(charSpan);
            });
            
            quoteDisplayElement.appendChild(wordSpan);
            
            // 마지막 단어가 아니면 스페이스 추가 (일반 span으로)
            if (wordIndex < words.length - 1) {
                const spaceSpan = document.createElement('span');
                spaceSpan.innerHTML = '&nbsp;';
                quoteDisplayElement.appendChild(spaceSpan);
            }
        });
        
        // [버그 수정] .word를 제외한 첫 번째 실제 문자 span에 current 추가
        const firstChar = Array.from(quoteDisplayElement.querySelectorAll('span')).find(span => 
            !span.classList.contains('word')
        );
        if (firstChar) firstChar.classList.add('current');
    }
    updateKeyboardHighlight();
    quoteInputElement.focus();
}

function restartCurrentSentence() {
    if (currentMode === 'game') { startGame(); return; }
    clearInterval(timer);
    startTime = null;
    isTransitioning = false;
    testEnded = false;
    quoteInputElement.value = '';
    quoteInputElement.disabled = false;
    
    if (currentMode === 'alphabet') {
        alphabetTypedCount = 0;
        wpmElement.innerText = '0';
        startTimer();
    } else {
        timerElement.innerText = currentMode === 'test' ? `${TEST_TIME}s` : '0s';
        wpmElement.innerText = '0';
        accuracyElement.innerText = '100%';
        wpmElement.style.color = '#333';
        quoteDisplayElement.querySelectorAll('span').forEach(s => s.classList.remove('correct', 'incorrect', 'current'));
        quoteDisplayElement.querySelector('span')?.classList.add('current');
    }
    
    updateKeyboardHighlight();
    quoteInputElement.focus();
}

function renderAlphabetUI() {
    const getChar = (index) => shuffledAlphabet[index] || '';
    document.querySelector('.alphabet-char.prev-2').textContent = getChar(alphabetIndex - 2);
    document.querySelector('.alphabet-char.prev-1').textContent = getChar(alphabetIndex - 1);
    document.querySelector('.alphabet-char.current').textContent = getChar(alphabetIndex);
    document.querySelector('.alphabet-char.next-1').textContent = getChar(alphabetIndex + 1);
    document.querySelector('.alphabet-char.next-2').textContent = getChar(alphabetIndex + 2);
    updateKeyboardHighlight();
}

function createKeyboard() {
    keyboardElement.innerHTML = '';
    const keysLayout = [
        ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
        ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
        ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
        ['ShiftLeft', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'ShiftRight'],
        ['ControlLeft', 'MetaLeft', 'AltLeft', 'Space', 'AltRight', 'MetaRight', 'ControlRight']
    ];
    keysLayout.forEach(row => {
        row.forEach(keyName => {
            const keyElement = document.createElement('div');
            keyElement.classList.add('key');
            let displayText = keyName.length === 1 ? keyName.toUpperCase() : keyName;
            if (keyName.includes('Control')) displayText = 'Ctrl';
            if (keyName.includes('Meta')) displayText = 'Win';
            if (keyName.includes('Alt')) displayText = 'Alt';
            if (keyName.includes('Shift')) displayText = 'Shift';
            keyElement.innerText = displayText;
            let dataKey;
            const keyMap = {'`':'Backquote', '-':'Minus', '=':'Equal', '[':'BracketLeft', ']':'BracketRight', '\\':'Backslash', ';':'Semicolon', "'":'Quote', ',':'Comma', '.':'Period', '/':'Slash'};
            if (keyMap[keyName]) dataKey = keyMap[keyName];
            else if (!isNaN(keyName)) dataKey = `Digit${keyName}`;
            else if (keyName.length === 1 && keyName.match(/[a-z]/i)) dataKey = `Key${keyName.toUpperCase()}`;
            else dataKey = keyName;
            keyElement.setAttribute('data-key', dataKey);
            keyboardElement.appendChild(keyElement);
        });
    });
}

function updateKeyboardHighlight() {
    document.querySelectorAll('.key.highlight').forEach(k => k.classList.remove('highlight'));
    let nextChar;
    
    // [버그 수정] .word만 제외한 실제 current span 찾기 (스페이스 포함)
    const allSpans = Array.from(quoteDisplayElement.querySelectorAll('span')).filter(span => 
        !span.classList.contains('word')
    );
    const currentSpan = allSpans.find(span => span.classList.contains('current'));
    
    if (currentMode === 'alphabet') {
        nextChar = shuffledAlphabet[alphabetIndex];
    } else if (currentSpan) {
        nextChar = currentSpan.innerHTML === '&nbsp;' ? ' ' : currentSpan.innerText;
    }
    
    if (!nextChar) return;
    let keyToFind;
    const keyMap = {'`':'Backquote', '-':'Minus', '=':'Equal', '[':'BracketLeft', ']':'BracketRight', '\\':'Backslash', ';':'Semicolon', "'":'Quote', ',':'Comma', '.':'Period', '/':'Slash', ' ':'Space'};
    if (keyMap[nextChar]) keyToFind = keyMap[nextChar];
    else if (!isNaN(nextChar)) keyToFind = `Digit${nextChar}`;
    else if (nextChar.length === 1) keyToFind = `Key${nextChar.toUpperCase()}`;
    
    if (keyToFind) {
        const keyElement = document.querySelector(`.key[data-key="${keyToFind}"]`);
        if (keyElement) keyElement.classList.add('highlight');
    }
}

function handleKeyDown(e) {
    if (typingScreen.classList.contains('hidden')) return;
    if ((e.ctrlKey && e.key.toLowerCase() === 'r') || e.key === 'F5') {
        e.preventDefault();
        if (currentMode === 'game' && e.key === 'F5') return;
        e.key.toLowerCase() === 'r' ? restartCurrentSentence() : renderNewText(true);
        return;
    }
    const nonTypingKeys = ['Control', 'Alt', 'Meta', 'Shift', 'CapsLock', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown', 'Insert', 'Delete', 'F1', 'F2', 'F3', 'F4', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'];
    if (nonTypingKeys.includes(e.key)) { return; }
    if (["Tab", "AltLeft", "AltRight", "MetaLeft", "MetaRight"].includes(e.code)) e.preventDefault();
    if (quoteInputElement.disabled) return;
    
    // [버그 수정] 연습 모드 엔터 조건 강화: 마지막 글자 위치에서만 엔터 허용
    if (e.key === 'Enter' && currentMode === 'practice') {
        e.preventDefault();
        const typedLength = quoteInputElement.value.length;
        const textLength = currentText.length;
        
        // 마지막 글자까지 입력했을 때만 엔터 허용
        if (typedLength === textLength) {
            const mistakes = document.querySelectorAll('#quote-display .incorrect').length;
            showFeedback(mistakes > 0 ? `${mistakes} mistakes.` : `Perfect!`);
            isTransitioning = true;
            setTimeout(() => renderNewText(true), 800);
        }
        return;
    }
    
    const keyElement = document.querySelector(`.key[data-key="${e.code}"]`);
    if (keyElement) keyElement.classList.add('active');
}

function handleKeyUp(e) {
    const keyElement = document.querySelector(`.key[data-key="${e.code}"]`);
    if (keyElement) keyElement.classList.remove('active');
}

// --- Game Mode Specific Functions ---
function startGame() {
    gameEnded = false; isTransitioning = false;
    playerPos = 0; aiPos = 0;
    currentWordIndex = 0;
    playerCar.style.left = '10px'; aiCar.style.left = '10px';
    
    // [버그 수정] 게임 모드 시작 시 알파벳 디스플레이 숨기기
    alphabetDisplayElement.classList.add('hidden');
    quoteDisplayElement.classList.remove('hidden');
    
    const easySelection = shuffleArray(easyGameWords).slice(0, 13);
    const normalSelection = shuffleArray(normalGameWords).slice(0, 5);
    const hardSelection = shuffleArray(hardGameWords).slice(0, 2);
    const gameWordPool = [...easySelection, ...normalSelection, ...hardSelection];
    shuffledGameWords = shuffleArray(gameWordPool);

    quoteInputElement.value = ''; quoteInputElement.disabled = false;
    quoteInputElement.focus();
    displayNextGameWord();
    startAi();
}

function displayNextGameWord() {
    if (currentWordIndex < shuffledGameWords.length) {
        quoteDisplayElement.classList.remove('hidden');
        const word = shuffledGameWords[currentWordIndex];
        quoteDisplayElement.innerHTML = '';
        
        // [버그 수정] 게임 모드에서도 단어를 word 클래스로 감싸기
        const wordSpan = document.createElement('span');
        wordSpan.classList.add('word');
        
        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.innerText = char;
            wordSpan.appendChild(charSpan);
        });
        
        quoteDisplayElement.appendChild(wordSpan);
        
        // [버그 수정] .word 안의 첫 번째 실제 문자 span에 current 클래스 추가
        const firstCharSpan = wordSpan.querySelector('span');
        if (firstCharSpan) firstCharSpan.classList.add('current');
        
        updateKeyboardHighlight();
    }
}

function startAi() {
    clearInterval(aiTimer);
    const speedMap = { easy: 3300, normal: 2200, hard: 1700 };
    aiTimer = setInterval(() => {
        if (gameEnded) { clearInterval(aiTimer); return; }
        aiPos++;
        const trackWidth = gameContainer.offsetWidth;
        const carWidth = aiCar.offsetWidth;
        const moveDistance = (trackWidth - carWidth - 40) / WORDS_PER_GAME;
        aiCar.style.left = `${10 + aiPos * moveDistance}px`;
        
        if (aiPos >= WORDS_PER_GAME) {
            endGame(false);
        }
    }, speedMap[currentLevel]);
}

function endGame(playerWon) {
    if (gameEnded) return;
    gameEnded = true; quoteInputElement.disabled = true; clearInterval(aiTimer);
    resultTitle.innerText = playerWon ? 'You Win!' : 'You Lose!';
    document.querySelector('.game-result-text').innerText = playerWon ? 'Congratulations!' : 'Better luck next time!';
    testResultStats.classList.add('hidden');
    gameResultMessage.classList.remove('hidden');
    finalLevelElement.innerText = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
    resultModal.classList.remove('hidden');
}

// --- Initial Load ---
createKeyboard();