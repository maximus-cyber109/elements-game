// ===================================
// MAIN APPLICATION
// ===================================

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new ElementsGame();
    game.init();
    
    // Initialize WebEngage if available
    if (typeof webengage !== 'undefined') {
        webengage.init(CONFIG.WEBENGAGE_LICENSE_CODE);
    }
});

// Handle messages from parent frame (Magento)
window.addEventListener('message', (event) => {
    // Handle parent frame communication
    if (event.data && event.data.action) {
        console.log('Message from parent:', event.data);
    }
});
