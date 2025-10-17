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
    draggedElement: null,
    touchStartY: 0,
    touchStartX: 0
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Elements Mastery Game Initialized');
    init();
});

function init() {
    getUserEmail();
    setupEventListeners();
    
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1500);
}

function getUserEmail() {
    const urlParams = new URLSearchParams(window.location.search);
    gameState.userEmail = urlParams.get('email') || 'guest@pinkblue.in';
    console.log('👤 User Email:', gameState.userEmail);
}

// ===================================
// EVENT LISTENERS
// ===================================
function setupEventListeners() {
    console.log('🎯 Setting up event listeners...');
    
    // Specialty selection
    const specialtyCards = document.querySelectorAll('.specialty-card');
    console.log('📋 Found specialty cards:', specialtyCards.length);
    
    specialtyCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const specialty = e.currentTarget.dataset.specialty;
            console.log('✅ Selected specialty:', specialty);
            selectSpecialty(specialty);
        });
    });
    
    // Submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }
    
    // Play again
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', resetGame);
    }
    
    // Shop now
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', shopNow);
    }
    
    // Copy coupon code
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCouponCode);
    }
}

// ===================================
// SPECIALTY SELECTION
// ===================================
function selectSpecialty(specialty) {
    console.log('🎯 Selecting specialty:', specialty);
    gameState.selectedSpecialty = specialty;
    
    // Hide modal
    const modal = document.getElementById('specialtyModal');
    const mainContainer = document.getElementById('mainContainer');
    const specialtyBadge = document.getElementById('specialtyBadge');
    
    console.log('🔍 Elements found:', {
        modal: !!modal,
        mainContainer: !!mainContainer,
        specialtyBadge: !!specialtyBadge
    });
    
    if (modal) {
        modal.classList.remove('active');
    }
    
    if (mainContainer) {
        mainContainer.classList.remove('hidden');
    }
    
    // Update badge
    const badges = {
        crown: 'Crown & Bridge Expert',
        cosmetic: 'Smile Designer',
        prevention: 'Prevention Champion',
        general: 'All-Rounder'
    };
    
    if (specialtyBadge) {
        specialtyBadge.textContent = badges[specialty];
    }
    
    // Load game
    loadGame(specialty);
}

// ===================================
// GAME LOADING
// ===================================
function loadGame(specialty) {
    console.log('🎮 Loading game for:', specialty);
    const gameData = GAME_DATA[specialty];
    
    if (!gameData) {
        console.error('❌ Game data not found for:', specialty);
        return;
    }
    
    // Set title and description
    const gameTitle = document.getElementById('gameTitle');
    const gameDescription = document.getElementById('gameDescription');
    const totalCount = document.getElementById('totalCount');
    
    if (gameTitle) gameTitle.textContent = gameData.title;
    if (gameDescription) gameDescription.textContent = gameData.description;
    if (totalCount) totalCount.textContent = gameData.steps.length;
    
    // Shuffle and render steps
    gameState.currentSteps = shuffleArray([...gameData.steps]);
    renderSteps();
    
    // Start timer
    startTimer();
    
    // Reset state
    gameState.droppedSteps = [];
    updateStepCounter();
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.disabled = true;
    }
    
    console.log('✅ Game loaded successfully');
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
    if (!stepsPool) {
        console.error('❌ Steps pool not found');
        return;
    }
    
    stepsPool.innerHTML = '';
    
    gameState.currentSteps.forEach((step, index) => {
        const stepEl = createStepElement(step, index);
        stepsPool.appendChild(stepEl);
    });
    
    setupDragAndDrop();
    console.log('✅ Steps rendered:', gameState.currentSteps.length);
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
// DRAG AND DROP (DESKTOP)
// ===================================
function setupDragAndDrop() {
    const dropZone = document.getElementById('dropZone');
    const steps = document.querySelectorAll('.step-item');
    
    if (!dropZone) {
        console.error('❌ Drop zone not found');
        return;
    }
    
    steps.forEach(step => {
        // Desktop drag events
        step.addEventListener('dragstart', handleDragStart);
        step.addEventListener('dragend', handleDragEnd);
        
        // Mobile touch events
        step.addEventListener('touchstart', handleTouchStart, { passive: false });
        step.addEventListener('touchmove', handleTouchMove, { passive: false });
        step.addEventListener('touchend', handleTouchEnd, { passive: false });
    });
    
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDrop);
    
    console.log('✅ Drag & drop setup complete');
}

function handleDragStart(e) {
    gameState.draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
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
        addStepToDropZone(gameState.draggedElement);
    }
}

// ===================================
// TOUCH HANDLING (MOBILE)
// ===================================
let touchClone = null;

function handleTouchStart(e) {
    const touch = e.touches[0];
    gameState.touchStartX = touch.clientX;
    gameState.touchStartY = touch.clientY;
    gameState.draggedElement = e.currentTarget;
    
    // Create visual clone for dragging
    touchClone = e.currentTarget.cloneNode(true);
    touchClone.style.position = 'fixed';
    touchClone.style.zIndex = '10000';
    touchClone.style.opacity = '0.8';
    touchClone.style.pointerEvents = 'none';
    touchClone.style.width = e.currentTarget.offsetWidth + 'px';
    touchClone.style.left = touch.clientX - (e.currentTarget.offsetWidth / 2) + 'px';
    touchClone.style.top = touch.clientY - 30 + 'px';
    document.body.appendChild(touchClone);
    
    e.currentTarget.style.opacity = '0.3';
}

function handleTouchMove(e) {
    e.preventDefault();
    
    if (!touchClone) return;
    
    const touch = e.touches[0];
    touchClone.style.left = touch.clientX - (touchClone.offsetWidth / 2) + 'px';
    touchClone.style.top = touch.clientY - 30 + 'px';
}

function handleTouchEnd(e) {
    if (!gameState.draggedElement) return;
    
    const touch = e.changedTouches[0];
    const dropZone = document.getElementById('dropZone');
    
    if (dropZone) {
        const dropRect = dropZone.getBoundingClientRect();
        
        // Check if touch ended inside drop zone
        if (
            touch.clientX >= dropRect.left &&
            touch.clientX <= dropRect.right &&
            touch.clientY >= dropRect.top &&
            touch.clientY <= dropRect.bottom
        ) {
            addStepToDropZone(gameState.draggedElement);
        }
    }
    
    // Cleanup
    if (touchClone) {
        touchClone.remove();
        touchClone = null;
    }
    
    if (gameState.draggedElement) {
        gameState.draggedElement.style.opacity = '1';
        gameState.draggedElement = null;
    }
}

// ===================================
// ADD STEP TO DROP ZONE
// ===================================
function addStepToDropZone(stepElement) {
    const dropZone = document.getElementById('dropZone');
    if (!dropZone) return;
    
    // Hide placeholder
    const placeholder = dropZone.querySelector('.drop-placeholder');
    if (placeholder) {
        placeholder.classList.add('hidden');
    }
    
    // Clone and add to drop zone
    const cloned = stepElement.cloneNode(true);
    cloned.classList.add('dropped');
    cloned.draggable = false;
    dropZone.appendChild(cloned);
    
    // Remove from pool
    stepElement.remove();
    
    // Track dropped step
    gameState.droppedSteps.push({
        id: parseInt(stepElement.dataset.stepId),
        order: parseInt(stepElement.dataset.correctOrder)
    });
    
    // Update counter
    updateStepCounter();
    
    // Enable submit if all dropped
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn && gameState.droppedSteps.length === gameState.currentSteps.length) {
        submitBtn.disabled = false;
    }
    
    console.log('✅ Step added. Progress:', gameState.droppedSteps.length, '/', gameState.currentSteps.length);
}

function updateStepCounter() {
    const droppedCount = document.getElementById('droppedCount');
    if (droppedCount) {
        droppedCount.textContent = gameState.droppedSteps.length;
    }
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
        const timerEl = document.getElementById('timer');
        if (timerEl) {
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
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
    console.log('🎯 Checking answer...');
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
    
    console.log('📊 Results:', { accuracy, isPerfect, timeTaken });
    
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
    const resultModal = document.getElementById('resultModal');
    if (resultModal) {
        resultModal.classList.add('active');
    }
    
    // Title and message
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (resultTitle) {
        resultTitle.textContent = isPerfect 
            ? 'Perfect Sequence!' 
            : accuracy >= 70 ? 'Great Effort!' : 'Keep Practicing!';
    }
    
    if (resultMessage) {
        resultMessage.textContent = isPerfect
            ? 'You\'ve mastered this clinical protocol!'
            : 'Review the correct sequence and try again!';
    }
    
    // Reward
    const rewardImage = document.getElementById('rewardImage');
    const rewardProduct = document.getElementById('rewardProduct');
    const rewardDiscount = document.getElementById('rewardDiscount');
    const couponCode = document.getElementById('couponCode');
    
    if (rewardImage) rewardImage.src = reward.image;
    if (rewardProduct) rewardProduct.textContent = reward.product;
    if (rewardDiscount) rewardDiscount.textContent = reward.discount;
    if (couponCode) couponCode.textContent = reward.code;
    
    // Stats
    const minutes = Math.floor(timeTaken / 60000);
    const seconds = Math.floor((timeTaken % 60000) / 1000);
    const statTime = document.getElementById('statTime');
    const statAccuracy = document.getElementById('statAccuracy');
    
    if (statTime) {
        statTime.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    if (statAccuracy) {
        statAccuracy.textContent = `${accuracy}%`;
    }
    
    // Educational tip
    const eduTipText = document.getElementById('eduTipText');
    if (eduTipText) {
        eduTipText.textContent = gameData.tip;
    }
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
    
    console.log('📤 Submitting game data:', payload);
    
    try {
        const response = await fetch('/api/submit-game', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        console.log('✅ Submission result:', result);
    } catch (error) {
        console.error('❌ Submission error:', error);
    }
}

// ===================================
// RESET GAME
// ===================================
function resetGame() {
    console.log('🔄 Resetting game...');
    
    // Hide result modal
    const resultModal = document.getElementById('resultModal');
    if (resultModal) {
        resultModal.classList.remove('active');
    }
    
    // Show specialty modal
    const specialtyModal = document.getElementById('specialtyModal');
    if (specialtyModal) {
        specialtyModal.classList.add('active');
    }
    
    // Hide main container
    const mainContainer = document.getElementById('mainContainer');
    if (mainContainer) {
        mainContainer.classList.add('hidden');
    }
    
    // Stop timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
}

// ===================================
// SHOP NOW
// ===================================
function shopNow() {
    const gameData = GAME_DATA[gameState.selectedSpecialty];
    const coupon = gameData.reward.code;
    
    console.log('🛒 Shop now with coupon:', coupon);
    
    // Send message to parent window (Magento iframe)
    window.parent.postMessage({
        action: 'applyCoupon',
        coupon: coupon
    }, '*');
}

// ===================================
// COPY COUPON CODE
// ===================================
function copyCouponCode() {
    const couponCode = document.getElementById('couponCode');
    if (!couponCode) return;
    
    const code = couponCode.textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            
            setTimeout(() => {
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                `;
            }, 2000);
        }
        
        console.log('✅ Coupon code copied:', code);
    }).catch(err => {
        console.error('❌ Copy failed:', err);
    });
}
