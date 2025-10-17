// ===================================
// GAME LOGIC
// ===================================

class ElementsGame {
    constructor() {
        this.selectedSpecialty = null;
        this.currentSteps = [];
        this.droppedSteps = [];
        this.startTime = null;
        this.timerInterval = null;
        this.userEmail = null;
        this.draggedElement = null;
    }

    init() {
        this.getUserEmail();
        this.showSpecialtyModal();
        this.setupEventListeners();
    }

    getUserEmail() {
        // Get email from URL parameter (passed from Magento iframe)
        const urlParams = new URLSearchParams(window.location.search);
        this.userEmail = urlParams.get('email') || 'guest@pinkblue.in';
    }

    showSpecialtyModal() {
        setTimeout(() => {
            document.getElementById('loadingScreen').classList.add('hidden');
            document.getElementById('overlay').classList.add('active');
            document.getElementById('specialtyModal').classList.add('active');
        }, 1000);
    }

    hideSpecialtyModal() {
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('specialtyModal').classList.remove('active');
    }

    setupEventListeners() {
        // Specialty selection
        document.querySelectorAll('.specialty-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const specialty = e.currentTarget.dataset.specialty;
                this.selectSpecialty(specialty);
            });
        });

        // Change specialty button
        document.getElementById('changeSpecialty').addEventListener('click', () => {
            this.showSpecialtyModal();
            document.getElementById('overlay').classList.add('active');
        });

        // Submit button
        document.getElementById('submitBtn').addEventListener('click', () => {
            this.checkAnswer();
        });

        // Play again button
        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.resetGame();
        });

        // Shop now button
        document.getElementById('shopNowBtn').addEventListener('click', () => {
            this.shopNow();
        });
    }

    selectSpecialty(specialty) {
        this.selectedSpecialty = specialty;
        this.hideSpecialtyModal();
        this.loadGame(specialty);
        document.getElementById('mainContainer').style.display = 'block';
        
        // Update specialty badge
        const specialtyNames = {
            crown: 'Crown & Bridge Expert',
            cosmetic: 'Smile Designer',
            prevention: 'Prevention Champion',
            endo: 'Endo Specialist',
            general: 'All-Rounder',
            clinic: 'Practice Owner'
        };
        document.getElementById('specialtyBadge').textContent = specialtyNames[specialty];
    }

    loadGame(specialty) {
        const gameData = GAME_DATA[specialty];
        
        // Set title and description
        document.getElementById('gameTitle').textContent = gameData.title;
        document.getElementById('gameDescription').textContent = gameData.description;
        
        // Shuffle steps
        this.currentSteps = this.shuffleArray([...gameData.steps]);
        
        // Render steps
        this.renderSteps();
        
        // Start timer
        this.startTimer();
        
        // Reset dropped steps
        this.droppedSteps = [];
        document.getElementById('submitBtn').disabled = true;
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderSteps() {
        const stepsPool = document.getElementById('stepsPool');
        stepsPool.innerHTML = '';
        
        this.currentSteps.forEach((step, index) => {
            const stepElement = this.createStepElement(step, index);
            stepsPool.appendChild(stepElement);
        });
        
        this.setupDragAndDrop();
    }

    createStepElement(step, index) {
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

    setupDragAndDrop() {
        const dropZone = document.getElementById('dropZone');
        const steps = document.querySelectorAll('.step-item');
        
        steps.forEach(step => {
            step.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
            });
            
            step.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            dropZone.classList.add('drag-over');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('drag-over');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            if (this.draggedElement) {
                // Hide instruction
                const instruction = dropZone.querySelector('.drop-instruction');
                if (instruction) {
                    instruction.classList.add('hidden');
                }
                
                // Clone and add to drop zone
                const clonedStep = this.draggedElement.cloneNode(true);
                clonedStep.classList.add('dropped');
                dropZone.appendChild(clonedStep);
                
                // Remove from pool
                this.draggedElement.remove();
                
                // Update dropped steps
                this.droppedSteps.push({
                    id: parseInt(this.draggedElement.dataset.stepId),
                    order: parseInt(this.draggedElement.dataset.correctOrder)
                });
                
                // Check if all steps are dropped
                if (this.droppedSteps.length === this.currentSteps.length) {
                    document.getElementById('submitBtn').disabled = false;
                }
                
                // Re-setup drag for dropped items
                this.setupDragForDroppedItems();
            }
        });
    }

    setupDragForDroppedItems() {
        const droppedSteps = document.querySelectorAll('.drop-zone .step-item');
        droppedSteps.forEach(step => {
            step.addEventListener('dragstart', (e) => {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
            });
            
            step.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });
        });
    }

    startTimer() {
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            document.getElementById('timer').textContent = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        return Date.now() - this.startTime;
    }

    checkAnswer() {
        const timeTaken = this.stopTimer();
        const dropZone = document.getElementById('dropZone');
        const droppedElements = Array.from(dropZone.querySelectorAll('.step-item.dropped'));
        
        // Get user's order
        const userOrder = droppedElements.map(el => parseInt(el.dataset.correctOrder));
        
        // Get correct order
        const correctOrder = this.currentSteps
            .sort((a, b) => a.order - b.order)
            .map(step => step.order);
        
        // Calculate accuracy
        let correctCount = 0;
        userOrder.forEach((order, index) => {
            if (order === correctOrder[index]) {
                correctCount++;
            }
        });
        
        const accuracy = Math.round((correctCount / correctOrder.length) * 100);
        const isPerfect = accuracy === 100;
        
        // Show result
        this.showResult(isPerfect, accuracy, timeTaken);
        
        // Log to Google Sheets
        this.logToGoogleSheets(isPerfect, accuracy, timeTaken);
    }

    showResult(isPerfect, accuracy, timeTaken) {
        const gameData = GAME_DATA[this.selectedSpecialty];
        const reward = gameData.reward;
        
        // Show modal
        document.getElementById('overlay').classList.add('active');
        document.getElementById('resultModal').classList.add('active');
        
        // Animation
        const animation = document.getElementById('resultAnimation');
        animation.className = 'result-animation ' + (isPerfect ? 'success' : 'partial');
        
        // Title and message
        const titles = {
            true: 'Perfect! Clinical Excellence!',
            false: accuracy >= 70 ? 'Great Job! Almost There!' : 'Good Effort! Keep Learning!'
        };
        document.getElementById('resultTitle').textContent = titles[isPerfect];
        
        const messages = {
            true: 'You\'ve demonstrated mastery of this clinical protocol. Your patients are in expert hands!',
            false: accuracy >= 70 
                ? 'You\'ve got the fundamentals right. Review the sequence and you\'ll be perfect next time!' 
                : 'Clinical protocols require practice. Review the correct sequence and try again!'
        };
        document.getElementById('resultMessage').textContent = messages[isPerfect];
        
        // Reward card
        document.getElementById('rewardImage').src = reward.image;
        document.getElementById('rewardProductName').textContent = reward.product;
        document.getElementById('rewardDiscount').textContent = reward.coupon.discount;
        document.getElementById('couponCode').textContent = `CODE: ${reward.coupon.code}`;
        
        // Stats
        const minutes = Math.floor(timeTaken / 60000);
        const seconds = Math.floor((timeTaken % 60000) / 1000);
        document.getElementById('timeTaken').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        document.getElementById('accuracy').textContent = `${accuracy}%`;
        
        // Educational tip
        document.getElementById('educationalTip').textContent = gameData.tip;
    }

    async logToGoogleSheets(isPerfect, accuracy, timeTaken) {
        const gameData = GAME_DATA[this.selectedSpecialty];
        
        const data = {
            timestamp: new Date().toISOString(),
            email: this.userEmail,
            specialty: this.selectedSpecialty,
            gameTitle: gameData.title,
            accuracy: accuracy,
            timeTaken: Math.floor(timeTaken / 1000), // seconds
            isPerfect: isPerfect,
            reward: gameData.reward.product,
            couponCode: gameData.reward.coupon.code,
            couponDiscount: gameData.reward.coupon.discount
        };
        
        try {
            const response = await fetch(CONFIG.GOOGLE_SHEET_WEBHOOK, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            console.log('Data logged to Google Sheets');
            
            // Also log to WebEngage if available
            if (typeof webengage !== 'undefined') {
                webengage.track('Elements Game Completed', data);
            }
        } catch (error) {
            console.error('Error logging to Google Sheets:', error);
        }
    }

    resetGame() {
        // Hide result modal
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('resultModal').classList.remove('active');
        
        // Clear drop zone
        const dropZone = document.getElementById('dropZone');
        const droppedSteps = dropZone.querySelectorAll('.step-item');
        droppedSteps.forEach(step => step.remove());
        
        // Show instruction again
        const instruction = dropZone.querySelector('.drop-instruction');
        if (instruction) {
            instruction.classList.remove('hidden');
        }
        
        // Reload game
        this.loadGame(this.selectedSpecialty);
    }

    shopNow() {
        const gameData = GAME_DATA[this.selectedSpecialty];
        const coupon = gameData.reward.coupon.code;
        
        // Redirect to product page with coupon (adjust URL as needed)
        window.parent.postMessage({
            action: 'applyCoupon',
            coupon: coupon
        }, '*');
        
        // Optionally close modal
        document.getElementById('overlay').classList.remove('active');
        document.getElementById('resultModal').classList.remove('active');
    }
}
