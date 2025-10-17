// ===================================
// GAME DATA
// ===================================
const GAME_DATA = {
    crown: {
        title: "Perfect Crown Prep Protocol",
        description: "Click steps in the correct clinical sequence",
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
            discount: 'FREEBIE + 15% Off',
            code: 'RETFREE15',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20retract.png'
        },
        tip: "Hemostatic retraction cords like Elements Retract control bleeding and fluid within 3-5 minutes, creating the ideal dry field for accurate impression capture. This ensures precise margin definition and high-quality final impressions."
    },
    
    cosmetic: {
        title: "Professional Whitening Workflow",
        description: "Click steps in the correct sequence for optimal results",
        steps: [
            { id: 1, text: "Patient consultation and shade assessment", order: 1 },
            { id: 2, text: "Polish teeth with pumice to remove pellicle", order: 2 },
            { id: 3, text: "Apply liquid dam to protect gingiva", order: 3 },
            { id: 4, text: "Apply Elements Whitening Gel to tooth surfaces", order: 4 },
            { id: 5, text: "Light activation for 15 minutes", order: 5 },
            { id: 6, text: "Remove gel and assess shade improvement", order: 6 },
            { id: 7, text: "Repeat process 2-3 times if needed", order: 7 },
            { id: 8, text: "Apply fluoride gel for sensitivity management", order: 8 }
        ],
        reward: {
            product: 'Elements Inoffice Whitening Kit',
            discount: '10% Flat Off',
            code: 'BLEACH10',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20bleaching%20kit.png'
        },
        tip: "Professional in-office whitening with high-concentration hydrogen peroxide delivers 6-8 shades improvement in a single visit. Always finish with fluoride application to reduce post-whitening sensitivity by up to 60% and strengthen enamel."
    },
    
    prevention: {
        title: "Topical Fluoride Application Protocol",
        description: "Click steps in the correct order for maximum effectiveness",
        steps: [
            { id: 1, text: "Complete prophylaxis - scaling and polishing", order: 1 },
            { id: 2, text: "Isolate and thoroughly dry teeth", order: 2 },
            { id: 3, text: "Apply Elements Fluoride Gel in custom tray", order: 3 },
            { id: 4, text: "Keep tray in place for 4 minutes", order: 4 },
            { id: 5, text: "Remove tray, patient expectorates excess", order: 5 },
            { id: 6, text: "Instruct no eating/drinking for 30 minutes", order: 6 },
            { id: 7, text: "Patient education on caries prevention", order: 7 }
        ],
        reward: {
            product: 'Elements Topical Fluoride Thixotropic Gel',
            discount: '10% Off',
            code: 'THIX10',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20thixotropic%20gel.png'
        },
        tip: "Thixotropic fluoride gels maintain high viscosity in trays but flow into interproximal spaces under pressure, providing superior penetration compared to liquid fluoride. This maximizes enamel remineralization while minimizing patient swallowing and gastric upset."
    },
    
    general: {
        title: "Daily Clinic Schedule Challenge",
        description: "Click appointments in optimal priority order",
        steps: [
            { id: 1, text: "Emergency - Post-extraction bleeding control", order: 1 },
            { id: 2, text: "Quick pediatric fluoride application (15min)", order: 2 },
            { id: 3, text: "Crown prep with impression (60min)", order: 3 },
            { id: 4, text: "Cosmetic whitening consultation (30min)", order: 4 },
            { id: 5, text: "Routine recall prophylaxis and fluoride", order: 5 }
        ],
        reward: {
            product: 'Elements Retract Multidose Syringe',
            discount: 'FREEBIE + 15% Off',
            code: 'RETFREE15',
            image: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20retract.png'
        },
        tip: "Smart clinic scheduling prioritizes emergencies first, followed by quick high-value procedures, then longer appointments. Elements products support diverse practice needs from hemostasis to aesthetics to prevention, streamlining your clinical workflow."
    }
};

// ===================================
// GAME STATE
// ===================================
let gameState = {
    selectedSpecialty: null,
    currentSteps: [],
    selectedSteps: [],
    selectionOrder: [],
    startTime: null,
    timerInterval: null,
    userEmail: null,
    customerId: null,
    hasPlayed: false
};

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Elements Mastery Game - Click-to-Select Version');
    init();
});

async function init() {
    // Check if email exists in URL
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    if (emailParam) {
        console.log('✅ Email found in URL:', emailParam);
        gameState.userEmail = emailParam;
        await validateAndStart(emailParam);
    } else {
        console.log('⚠️ No email in URL - showing email modal');
        setTimeout(() => {
            hideLoadingScreen();
            showEmailModal();
        }, 1000);
    }
    
    setupEventListeners();
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
    }
}

function showEmailModal() {
    const emailModal = document.getElementById('emailModal');
    if (emailModal) {
        emailModal.classList.add('active');
    }
}

// ===================================
// EMAIL VALIDATION
// ===================================
async function validateAndStart(email) {
    console.log('🔍 Validating email:', email);
    
    try {
        // Check if already played
        const checkResponse = await fetch('/api/check-game-played', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const checkData = await checkResponse.json();
        console.log('📊 Check response:', checkData);
        
        if (checkData.hasPlayed) {
            console.log('⚠️ User already played');
            showAlreadyPlayedModal(checkData.couponCode || 'RETFREE15');
            hideLoadingScreen();
            return;
        }
        
        // Validate email with Magento
        const validateResponse = await fetch('/api/validate-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });
        
        const validateData = await validateResponse.json();
        console.log('✅ Validation response:', validateData);
        
        if (validateData.isValid) {
            gameState.customerId = validateData.customerId;
            hideLoadingScreen();
            showSpecialtyModal();
        } else {
            showEmailError('Email not found. Please use your registered PinkBlue Dental email.');
            hideLoadingScreen();
            showEmailModal();
        }
        
    } catch (error) {
        console.error('❌ Validation error:', error);
        // Allow game to continue even if validation fails
        hideLoadingScreen();
        showSpecialtyModal();
    }
}

function showAlreadyPlayedModal(couponCode) {
    const modal = document.getElementById('alreadyPlayedModal');
    const codeEl = document.getElementById('previousCouponCode');
    
    if (modal) modal.classList.add('active');
    if (codeEl) codeEl.textContent = couponCode;
}

function showSpecialtyModal() {
    const modal = document.getElementById('specialtyModal');
    if (modal) modal.classList.add('active');
}

function showEmailError(message) {
    const errorEl = document.getElementById('emailError');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
}

// ===================================
// EVENT LISTENERS
// ===================================
function setupEventListeners() {
    // Email verification
    const verifyBtn = document.getElementById('verifyEmailBtn');
    if (verifyBtn) {
        verifyBtn.addEventListener('click', handleEmailVerification);
    }
    
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
        emailInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleEmailVerification();
        });
    }
    
    // Specialty selection
    document.querySelectorAll('.specialty-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const specialty = e.currentTarget.dataset.specialty;
            selectSpecialty(specialty);
        });
    });
    
    // Submit button
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
        submitBtn.addEventListener('click', checkAnswer);
    }
    
    // Shop now buttons
    const shopNowBtn = document.getElementById('shopNowBtn');
    if (shopNowBtn) {
        shopNowBtn.addEventListener('click', shopNow);
    }
    
    const shopNowBtnAlready = document.getElementById('shopNowBtnAlready');
    if (shopNowBtnAlready) {
        shopNowBtnAlready.addEventListener('click', shopNow);
    }
    
    // Copy coupon
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyCouponCode);
    }
}

async function handleEmailVerification() {
    const emailInput = document.getElementById('emailInput');
    const verifyBtn = document.getElementById('verifyEmailBtn');
    
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showEmailError('Please enter a valid email address');
        return;
    }
    
    // Show loading state
    if (verifyBtn) {
        verifyBtn.disabled = true;
        verifyBtn.querySelector('.btn-content span').textContent = 'Verifying...';
    }
    
    gameState.userEmail = email;
    
    // Hide email modal
    const emailModal = document.getElementById('emailModal');
    if (emailModal) emailModal.classList.remove('active');
    
    // Show loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) loadingScreen.classList.remove('hidden');
    
    // Validate
    await validateAndStart(email);
}

// ===================================
// SPECIALTY SELECTION
// ===================================
function selectSpecialty(specialty) {
    console.log('🎯 Selected specialty:', specialty);
    gameState.selectedSpecialty = specialty;
    
    const specialtyModal = document.getElementById('specialtyModal');
    const mainContainer = document.getElementById('mainContainer');
    const specialtyBadge = document.getElementById('specialtyBadge');
    
    if (specialtyModal) specialtyModal.classList.remove('active');
    if (mainContainer) mainContainer.classList.remove('hidden');
    
    const badges = {
        crown: 'Crown & Bridge Expert',
        cosmetic: 'Smile Designer',
        prevention: 'Prevention Champion',
        general: 'All-Rounder'
    };
    
    if (specialtyBadge) specialtyBadge.textContent = badges[specialty];
    
    loadGame(specialty);
}

// ===================================
// GAME LOADING
// ===================================
function loadGame(specialty) {
    console.log('🎮 Loading game for:', specialty);
    const gameData = GAME_DATA[specialty];
    
    if (!gameData) {
        console.error('❌ Game data not found');
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
    gameState.selectedSteps = [];
    gameState.selectionOrder = [];
    updateStepCounter();
    
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) submitBtn.disabled = true;
    
    console.log('✅ Game loaded');
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
    
    console.log('✅ Steps rendered:', gameState.currentSteps.length);
}

function createStepElement(step) {
    const div = document.createElement('div');
    div.className = 'step-item-click';
    div.dataset.stepId = step.id;
    div.dataset.correctOrder = step.order;
    
    div.innerHTML = `
        <div class="step-selection-number">?</div>
        <div class="step-text-click">${step.text}</div>
    `;
    
    // Click event for selection
    div.addEventListener('click', () => toggleStepSelection(div, step));
    
    return div;
}

// ===================================
// CLICK-TO-SELECT LOGIC
// ===================================
function toggleStepSelection(element, step) {
    const isSelected = element.classList.contains('selected');
    
    if (isSelected) {
        // Deselect
        deselectStep(element, step);
    } else {
        // Select
        selectStep(element, step);
    }
    
    updateStepCounter();
    checkSubmitButton();
}

function selectStep(element, step) {
    const selectionNumber = gameState.selectionOrder.length + 1;
    
    element.classList.add('selected');
    element.querySelector('.step-selection-number').textContent = selectionNumber;
    
    gameState.selectedSteps.push({
        element: element,
        step: step,
        selectionNumber: selectionNumber
    });
    
    gameState.selectionOrder.push(step.order);
    
    console.log('✅ Selected:', step.text, '- Position:', selectionNumber);
}

function deselectStep(element, step) {
    element.classList.remove('selected');
    element.querySelector('.step-selection-number').textContent = '?';
    
    // Find and remove from selected steps
    const index = gameState.selectedSteps.findIndex(s => s.step.id === step.id);
    if (index > -1) {
        const removedNumber = gameState.selectedSteps[index].selectionNumber;
        gameState.selectedSteps.splice(index, 1);
        gameState.selectionOrder.splice(index, 1);
        
        // Renumber remaining steps
        gameState.selectedSteps.forEach((selected, idx) => {
            const newNumber = idx + 1;
            selected.selectionNumber = newNumber;
            selected.element.querySelector('.step-selection-number').textContent = newNumber;
        });
    }
    
    console.log('❌ Deselected:', step.text);
}

function updateStepCounter() {
    const selectedCount = document.getElementById('selectedCount');
    if (selectedCount) {
        selectedCount.textContent = gameState.selectedSteps.length;
    }
}

function checkSubmitButton() {
    const submitBtn = document.getElementById('submitBtn');
    if (!submitBtn) return;
    
    const totalSteps = gameState.currentSteps.length;
    const selectedCount = gameState.selectedSteps.length;
    
    submitBtn.disabled = selectedCount !== totalSteps;
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
    
    // Get user's order
    const userOrder = gameState.selectionOrder;
    
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
    
    console.log('📊 Results:', { 
        userOrder, 
        correctOrder, 
        accuracy, 
        isPerfect 
    });
    
    showResult(isPerfect, accuracy, timeTaken);
    submitGameData(isPerfect, accuracy, timeTaken);
}

// ===================================
// SHOW RESULT
// ===================================
function showResult(isPerfect, accuracy, timeTaken) {
    const gameData = GAME_DATA[gameState.selectedSpecialty];
    const reward = gameData.reward;
    
    const resultModal = document.getElementById('resultModal');
    if (resultModal) resultModal.classList.add('active');
    
    // Title and message
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');
    
    if (resultTitle) {
        resultTitle.textContent = isPerfect 
            ? 'Perfect Sequence! 🎉' 
            : accuracy >= 70 ? 'Great Effort!' : 'Keep Learning!';
    }
    
    if (resultMessage) {
        resultMessage.textContent = isPerfect
            ? 'You\'ve mastered this clinical protocol. Here\'s your exclusive reward!'
            : accuracy >= 70 
                ? 'You got most steps right! Here\'s a reward for your effort.'
                : 'Good try! Review the correct sequence and use this discount.';
    }
    
    // Reward details
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
        customerId: gameState.customerId,
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
        
        // Mark as played
        gameState.hasPlayed = true;
        
    } catch (error) {
        console.error('❌ Submission error:', error);
    }
}

// ===================================
// SHOP NOW
// ===================================
function shopNow() {
    const gameData = GAME_DATA[gameState.selectedSpecialty];
    const coupon = gameData ? gameData.reward.code : 'RETFREE15';
    
    console.log('🛒 Shop now with coupon:', coupon);
    
    // Send message to parent window (Magento)
    window.parent.postMessage({
        action: 'applyCoupon',
        coupon: coupon
    }, '*');
    
    // Optionally redirect
    // window.location.href = `https://pinkblue.in/checkout?coupon=${coupon}`;
}

// ===================================
// COPY COUPON CODE
// ===================================
function copyCouponCode() {
    const couponCode = document.getElementById('couponCode');
    if (!couponCode) return;
    
    const code = couponCode.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.getElementById('copyBtn');
        if (copyBtn) {
            // Change to checkmark
            copyBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                </svg>
            `;
            
            // Revert after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                    </svg>
                `;
            }, 2000);
        }
        
        console.log('✅ Coupon copied:', code);
    }).catch(err => {
        console.error('❌ Copy failed:', err);
        alert('Coupon code: ' + code);
    });
}
