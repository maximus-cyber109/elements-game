// ===================================
// CONFIGURATION
// ===================================

const CONFIG = {
    // Google Sheets Webhook URL
    GOOGLE_SHEET_WEBHOOK: 'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE',
    
    // Magento API Configuration
    MAGENTO_API_BASE: 'YOUR_MAGENTO_API_BASE_URL_HERE',
    MAGENTO_BEARER_TOKEN: 'YOUR_MAGENTO_BEARER_TOKEN_HERE',
    
    // WebEngage Configuration
    WEBENGAGE_LICENSE_CODE: 'YOUR_WEBENGAGE_LICENSE_CODE_HERE',
    
    // Product Images
    PRODUCT_IMAGES: {
        retract: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20retract.png',
        bleaching: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20bleaching%20kit.png',
        thixotropic: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/elements%20thixotropic%20gel.png',
        reflect: 'https://email-editor-resources.s3.amazonaws.com/images/82618240/reflect%20alginate.png'
    },
    
    // Coupon Codes
    COUPONS: {
        retract: {
            code: 'RETFREE15',
            discount: 'FREE Sample + 15% Off',
            type: 'freebie'
        },
        bleaching: {
            code: 'BLEACH10',
            discount: '10% Flat Off',
            type: 'discount'
        },
        reflect: {
            code: 'REFL15',
            discount: '5% Off',
            type: 'discount'
        },
        thixotropic: {
            code: 'THIX10',
            discount: '10% Off',
            type: 'discount'
        }
    }
};

// Game Data for Different Specialties
const GAME_DATA = {
    crown: {
        title: "Perfect Crown Prep Protocol",
        description: "Arrange the crown preparation steps in the correct clinical sequence",
        steps: [
            { id: 1, text: "Tooth preparation and margin design", order: 1 },
            { id: 2, text: "Apply Elements Retract cord in sulcus", order: 2 },
            { id: 3, text: "Remove cord after 7-10 minutes", order: 3 },
            { id: 4, text: "Clean prep area and verify margins are visible", order: 4 },
            { id: 5, text: "Shade selection in dry, clean field", order: 5 },
            { id: 6, text: "Take final impression", order: 6 },
            { id: 7, text: "Temporization", order: 7 }
        ],
        reward: {
            product: 'Elements Retract Multidose Syringe',
            coupon: CONFIG.COUPONS.retract,
            image: CONFIG.PRODUCT_IMAGES.retract
        },
        tip: "Hemostatic retraction cords like Elements Retract control bleeding and crevicular fluid within 3-5 minutes, creating the ideal dry field for accurate impression capture. The ferrous sulfate formulation provides rapid hemostasis without tissue damage."
    },
    
    cosmetic: {
        title: "Professional Whitening Workflow",
        description: "Sequence the in-office whitening procedure for optimal results",
        steps: [
            { id: 1, text: "Patient consultation and shade assessment", order: 1 },
            { id: 2, text: "Polish teeth with pumice to remove pellicle", order: 2 },
            { id: 3, text: "Apply liquid dam to protect gingiva", order: 3 },
            { id: 4, text: "Apply Elements Whitening Gel to teeth", order: 4 },
            { id: 5, text: "Light activation for 15 minutes", order: 5 },
            { id: 6, text: "Remove gel and assess shade improvement", order: 6 },
            { id: 7, text: "Repeat process 2-3 times if needed", order: 7 },
            { id: 8, text: "Apply Elements Fluoride Gel for sensitivity management", order: 8 }
        ],
        reward: {
            product: 'Elements Inoffice Whitening Kit',
            coupon: CONFIG.COUPONS.bleaching,
            image: CONFIG.PRODUCT_IMAGES.bleaching
        },
        tip: "High-concentration hydrogen peroxide in professional kits delivers 6-8 shades improvement in a single visit. Always finish with fluoride application to reduce post-whitening sensitivity by up to 60%."
    },
    
    prevention: {
        title: "Topical Fluoride Application Protocol",
        description: "Arrange the fluoride application steps for maximum effectiveness",
        steps: [
            { id: 1, text: "Prophylaxis - scaling and polishing", order: 1 },
            { id: 2, text: "Isolate and dry teeth thoroughly", order: 2 },
            { id: 3, text: "Apply Elements Fluoride Gel in tray", order: 3 },
            { id: 4, text: "Keep tray in place for 4 minutes", order: 4 },
            { id: 5, text: "Remove tray, ask patient to expectorate", order: 5 },
            { id: 6, text: "Instruct no eating/drinking for 30 minutes", order: 6 },
            { id: 7, text: "Patient education on caries prevention", order: 7 }
        ],
        reward: {
            product: 'Elements Topical Fluoride Thixotropic Gel',
            coupon: CONFIG.COUPONS.thixotropic,
            image: CONFIG.PRODUCT_IMAGES.thixotropic
        },
        tip: "Thixotropic fluoride gels maintain high viscosity in the tray but flow into interproximal spaces under pressure, providing superior penetration compared to liquid fluoride while minimizing patient swallowing."
    },
    
    endo: {
        title: "Root Canal Treatment Sequence",
        description: "Organize the endodontic procedure steps correctly",
        steps: [
            { id: 1, text: "Access cavity preparation", order: 1 },
            { id: 2, text: "Apply Elements Retract if access bleeding occurs", order: 2 },
            { id: 3, text: "Working length determination", order: 3 },
            { id: 4, text: "Irrigation with NaOCl solution", order: 4 },
            { id: 5, text: "Cleaning and shaping with files", order: 5 },
            { id: 6, text: "Master cone selection and fit", order: 6 },
            { id: 7, text: "Obturation with gutta-percha", order: 7 },
            { id: 8, text: "Post-operative radiograph", order: 8 }
        ],
        reward: {
            product: 'Elements Retract Multidose Syringe',
            coupon: CONFIG.COUPONS.retract,
            image: CONFIG.PRODUCT_IMAGES.retract
        },
        tip: "Bleeding during endo access can compromise canal visualization and working length determination. Hemostatic solutions provide quick control without the tissue damage associated with electrosurgery."
    },
    
    general: {
        title: "Daily Clinic Schedule Challenge",
        description: "Prioritize your patient appointments for optimal workflow",
        steps: [
            { id: 1, text: "Emergency - Post-extraction bleeding control", order: 1 },
            { id: 2, text: "Pediatric patient - Fluoride application (15 min)", order: 2 },
            { id: 3, text: "Crown prep with impression (60 min)", order: 3 },
            { id: 4, text: "In-office whitening consultation (30 min)", order: 4 },
            { id: 5, text: "Routine recall - Prophylaxis and fluoride", order: 5 }
        ],
        reward: {
            product: 'Elements Complete Kit - Your Choice',
            coupon: {
                code: 'ELEMENTS30',
                discount: '30% Off Any 2 Elements Products',
                type: 'combo'
            },
            image: CONFIG.PRODUCT_IMAGES.retract
        },
        tip: "Smart clinic scheduling prioritizes emergencies first, followed by quick procedures, then longer appointments. Elements products support diverse practice needs from hemostasis to aesthetics to prevention."
    },
    
    clinic: {
        title: "Smart Inventory Planning",
        description: "Optimize your multi-doctor clinic's Elements product stock",
        steps: [
            { id: 1, text: "Assess monthly usage patterns across all doctors", order: 1 },
            { id: 2, text: "Prioritize high-volume items (Fluoride for all patients)", order: 2 },
            { id: 3, text: "Stock prosthetic essentials (Retract for crown/bridge)", order: 3 },
            { id: 4, text: "Plan aesthetic inventory (Whitening for 2-3 cases/week)", order: 4 },
            { id: 5, text: "Calculate bulk order discounts and storage capacity", order: 5 },
            { id: 6, text: "Set reorder triggers at 30% remaining stock", order: 6 }
        ],
        reward: {
            product: 'Elements Bulk Bundle - Practice Package',
            coupon: {
                code: 'BULK50',
                discount: '50% Off on 5+ Products',
                type: 'bulk'
            },
            image: CONFIG.PRODUCT_IMAGES.bleaching
        },
        tip: "Multi-chair practices benefit from bulk ordering with proper inventory rotation. Elements products have excellent shelf stability, making them ideal for bulk purchase programs."
    }
};
