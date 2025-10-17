// ===================================
// GAME DATA
// ===================================
const GAME_DATA = {
    crown: {
        title: "Perfect Crown Prep Protocol",
        description: "Arrange the crown preparation steps in correct clinical sequence",
        steps: [
            { id: 1, text: "Tooth preparation and margin design", order: 1 },
            { id: 2, text: "Apply Elements Retract cord in sulcus", order: 2 },
            { id: 3, text: "Remove cord after 7-10 minutes", order: 3 },
            { id: 4, text: "Clean prep area and verify margins visible", order: 4 },
            { id: 5, text: "Shade selection in dry, clean field", order: 5 },
            { id: 6, text: "Take final impression", order: 6 },
            { id: 7, text: "Temporization", order: 7 }
        ],
        reward: {
            product: 'Elements Retract Multidose Syringe',
            discount: 'FREE Sample + 15% Off',
            code: 'RETFREE15',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20retract.png'
        },
        tip: "Hemostatic retraction cords like Elements Retract control bleeding and fluid within 3-5 minutes, creating the ideal dry field for accurate impression capture."
    },
    
    cosmetic: {
        title: "Professional Whitening Workflow",
        description: "Sequence the in-office whitening procedure for optimal results",
        steps: [
            { id: 1, text: "Patient consultation and shade assessment", order: 1 },
            { id: 2, text: "Polish teeth with pumice", order: 2 },
            { id: 3, text: "Apply liquid dam to protect gingiva", order: 3 },
            { id: 4, text: "Apply Elements Whitening Gel", order: 4 },
            { id: 5, text: "Light activation for 15 minutes", order: 5 },
            { id: 6, text: "Remove gel and assess improvement", order: 6 },
            { id: 7, text: "Repeat process 2-3 times if needed", order: 7 },
            { id: 8, text: "Apply fluoride for sensitivity", order: 8 }
        ],
        reward: {
            product: 'Elements Inoffice Whitening Kit',
            discount: '10% Flat Off',
            code: 'BLEACH10',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20bleaching%20kit.png'
        },
        tip: "Professional whitening delivers 6-8 shades improvement in a single visit. Always finish with fluoride to reduce sensitivity by up to 60%."
    },
    
    prevention: {
        title: "Topical Fluoride Application Protocol",
        description: "Arrange fluoride application steps for maximum effectiveness",
        steps: [
            { id: 1, text: "Prophylaxis - scaling and polishing", order: 1 },
            { id: 2, text: "Isolate and dry teeth thoroughly", order: 2 },
            { id: 3, text: "Apply Elements Fluoride Gel in tray", order: 3 },
            { id: 4, text: "Keep tray in place for 4 minutes", order: 4 },
            { id: 5, text: "Remove tray, patient expectorates", order: 5 },
            { id: 6, text: "Instruct no eating for 30 minutes", order: 6 },
            { id: 7, text: "Patient education on prevention", order: 7 }
        ],
        reward: {
            product: 'Elements Topical Fluoride Gel',
            discount: '10% Off',
            code: 'THIX10',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20thixotropic%20gel.png'
        },
        tip: "Thixotropic gels maintain high viscosity in trays but flow into interproximal spaces, providing superior penetration while minimizing swallowing."
    },
    
    general: {
        title: "Daily Clinic Schedule Challenge",
        description: "Prioritize patient appointments for optimal workflow",
        steps: [
            { id: 1, text: "Emergency - Post-extraction bleeding", order: 1 },
            { id: 2, text: "Pediatric fluoride application (15min)", order: 2 },
            { id: 3, text: "Crown prep with impression (60min)", order: 3 },
            { id: 4, text: "Whitening consultation (30min)", order: 4 },
            { id: 5, text: "Routine prophylaxis and fluoride", order: 5 }
        ],
        reward: {
            product: 'Elements Retract Multidose Syringe',
            discount: 'FREE Sample + 15% Off',
            code: 'RETFREE15',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20retract.png'
        },
        tip: "Smart scheduling prioritizes emergencies first, then quick procedures, followed by longer appointments. Elements products support diverse practice needs."
    }
};

// ===================================
// GAME STATE
// ===================================
let gameState = {
    selectedSpecialty: null,
    currentSteps: [],
    droppedSteps: [],
    startTime: null,
    timerInterval: null,
    userEmail: null,
    draggedElement: null
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    getUserEmail();
    setupEventListeners();
    
    // Hide loading screen after 1 second
    setTimeout(() => {
        document.getElementById('loadingScreen').classList.add('hidden');
        document.getElementById('overlay').classList.add('active');
    }, 1000);
}

function getUserEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    gameState.userEmail = urlParams.get('email') || 'guest@pinkblue.in';
}

// ===================================
// EVENT LISTENERS
// ===================================
function setupEventListeners() {
    // Specialty selection
    document.querySelectorAll('.specialty-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const specialty = e.currentTarget.dataset.specialty;
            selectSpecialty(specialty);
        });
    });
    
    // Submit button
    document.getElementById('submitBtn').addEventListener('click', checkAnswer);
    
    // Play again
    document.getElementById('playAgainBtn').addEventListener('click', resetGame);
    
    // Shop now
    document.getElementById('shopNowBtn').addEventListener('click', shopNow);
}

// ===================================
// SPECIALTY SELECTION
// ===================================
function selectSpecialty(specialty) {
    gameState.selectedSpecialty = specialty;
    
    // Hide modal
    document.getElementById('specialtyModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    
    // Show main container
    document.getElementById('mainContainer').classList.remove('hidden');
    
    // Update badge
    const badges = {
        crown: 'Crown & Bridge Expert',
        cosmetic: 'Smile Designer',
        prevention: 'Prevention Champion',
        general: 'All-Rounder'
    };
    document.getElementById('specialtyBadge').textContent = badges[specialty];
    
    // Load game
    loadGame(specialty);
}

// ===================================
// GAME LOADING
// ===================================
function loadGame(specialty) {
    const gameData = GAME_DATA[specialty];
    
    // Set title and description
    document.getElementById('gameTitle').textContent = gameData.title;
    document.getElementById('gameDescription').textContent = gameData.description;
    
    // Shuffle and render steps
    gameState.currentSteps = shuffleArray([...gameData.steps]);
    renderSteps();
    
    // Start timer
    startTimer();
    
    // Reset state
    gameState.droppedSteps = [];
    document.getElementById('submitBtn').disabled = true;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function renderSteps() {
    const stepsPool = document.getElementById('stepsPool');
    stepsPool.innerHTML = '';
    
    gameState.currentSteps.forEach((step, index) => {
        const stepEl = createStepElement(step, index);
        stepsPool.appendChild(stepEl);
    });
    
    setupDragAndDrop();
}

function createStepElement(step, index) {
    const div = document.createElement('div');
    div.className = 'step-item';
    div.draggable = true;
    div.dataset.stepId = step.id;
    div.dataset.correctOrder = step.order;
    
    div.innerHTML = `
        <div class="step-number">${String.fromCharCode(65 + index)}</div>
        <div class="step-text">${step.text}</div>
    `;
    
    return div;
}

// ===================================
// DRAG AND DROP
// ===================================
function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    const steps = document.querySelectorAll('.step-item');
    
    steps.forEach(step => {
        step.addEventListener('dragstart', handleDragStart);
        step.addEventListener('dragend', handleDragEnd);
    });
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
}

function handleDragStart(e) {
    gameState.draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.currentTarget;
    dropZone.classList.remove('drag-over');
    
    if (gameState.draggedElement) {
        // Hide placeholder
        const placeholder = dropZone.querySelector('.drop-placeholder');
        if (placeholder) placeholder.classList.add('hidden');
        
        // Clone and add to drop zone
        const cloned = gameState.draggedElement.cloneNode(true);
        cloned.classList.add('dropped');
        dropZone.appendChild(cloned);
        
        // Remove from pool
        gameState.draggedElement.remove();
        
        // Track dropped step
        gameState.droppedSteps.push({
            id: parseInt(gameState.draggedElement.dataset.stepId),
            order: parseInt(gameState.draggedElement.dataset.correctOrder)
        });
        
        // Enable submit if all dropped
        if (gameState.droppedSteps.length === gameState.currentSteps.length) {
            document.getElementById('submitBtn').disabled = false;
        }
        
        // Re-setup drag for dropped items
        setupDragForDropped();
    }
}

function setupDragForDropped() {
    const droppedSteps = document.querySelectorAll('.drop-zone .step-item');
    droppedSteps.forEach(step => {
        step.addEventListener('dragstart', handleDragStart);
        step.addEventListener('dragend', handleDragEnd);
    });
}

// ===================================
// TIMER
// ===================================
function startTimer() {
    gameState.startTime = Date.now();
    gameState.timerInterval = setInterval(() => {
        const elapsed = Date.now() - gameState.startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('timer').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    return Date.now() - gameState.startTime;
}

// ===================================
// CHECK ANSWER
// ===================================
function checkAnswer() {
    const timeTaken = stopTimer();
    const dropZone = document.getElementById('dropZone');
    const droppedElements = Array.from(dropZone.querySelectorAll('.step-item.dropped'));
    
    // Get user's order
    const userOrder = droppedElements.map(el => parseInt(el.dataset.correctOrder));
    
    // Get correct order
    const correctOrder = gameState.currentSteps
        .sort((a, b) => a.order - b.order)
        .map(step => step.order);
    
    // Calculate accuracy
    let correctCount = 0;
    userOrder.forEach((order, index) => {
        if (order === correctOrder[index]) correctCount++;
    });
    
    const accuracy = Math.round((correctCount / correctOrder.length) * 100);
    const isPerfect = accuracy === 100;
    
    // Show result
    showResult(isPerfect, accuracy, timeTaken);
    
    // Submit to backend
    submitGameData(isPerfect, accuracy, timeTaken);
}

// ===================================
// SHOW RESULT
// ===================================
function showResult(isPerfect, accuracy, timeTaken) {
    const gameData = GAME_DATA[gameState.selectedSpecialty];
    const reward = gameData.reward;
    
    // Show modal
    document.getElementById('overlay').classList.add('active');
    document.getElementById('resultModal').classList.add('active');
    
    // Result icon
    const icon = document.getElementById('resultIcon');
    icon.className = 'result-icon ' + (isPerfect ? 'success' : 'partial');
    
    // Title and message
    document.getElementById('resultTitle').textContent = isPerfect 
        ? 'Perfect Sequence!' 
        : accuracy >= 70 ? 'Great Effort!' : 'Keep Practicing!';
    
    document.getElementById('resultMessage').textContent = isPerfect
        ? 'You\'ve mastered this clinical protocol!'
        : 'Review the correct sequence and try again!';
    
    // Reward
    document.getElementById('rewardImage').src = reward.image;
    document.getElementById('rewardProduct').textContent = reward.product;
    document.getElementById('rewardDiscount').textContent = reward.discount;
    document.getElementById('couponCode').textContent = reward.code;
    
    // Stats
    const minutes = Math.floor(timeTaken / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);
    document.getElementById('statTime').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    document.getElementById('statAccuracy').textContent = `${accuracy}%`;
    
    // Educational tip
    document.getElementById('eduTipText').textContent = gameData.tip;
}

// ===================================
// SUBMIT TO BACKEND
// ===================================
async function submitGameData(isPerfect, accuracy, timeTaken) {
    const gameData = GAME_DATA[gameState.selectedSpecialty];
    
    const payload = {
        timestamp: new Date().toISOString(),
        email: gameState.userEmail,
        specialty: gameState.selectedSpecialty,
        gameTitle: gameData.title,
        accuracy: accuracy,
        timeTaken: Math.floor(timeTaken / 1000),
        isPerfect: isPerfect,
        reward: gameData.reward.product,
        couponCode: gameData.reward.code,
        couponDiscount: gameData.reward.discount
    };
    
    try {
        const response = await fetch('/api/submit-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        console.log('Submission result:', result);
    } catch (error) {
        console.error('Submission error:', error);
    }
}

// ===================================
// RESET GAME
// ===================================
function resetGame() {
    // Hide result modal
    document.getElementById('overlay').classList.remove('active');
    document.getElementById('resultModal').classList.remove('active');
    
    // Clear drop zone
    const dropZone = document.getElementById('dropZone');
    dropZone.querySelectorAll('.step-item').forEach(el => el.remove());
    
    // Show placeholder
    const placeholder = dropZone.querySelector('.drop-placeholder');
    if (placeholder) placeholder.classList.remove('hidden');
    
    // Show specialty modal
    document.getElementById('specialtyModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    
    // Hide main container
    document.getElementById('mainContainer').classList.add('hidden');
}

// ===================================
// SHOP NOW
// ===================================
function shopNow() {
    const gameData = GAME_DATA[gameState.selectedSpecialty];
    const coupon = gameData.reward.code;
    
    // Send message to parent window (Magento iframe)
    window.parent.postMessage({
        action: 'applyCoupon',
        coupon: coupon
    }, '*');
}
