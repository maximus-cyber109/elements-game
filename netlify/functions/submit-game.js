const axios = require('axios');

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    console.log('=== ELEMENTS GAME SUBMISSION ===');

    try {
        const gameData = JSON.parse(event.body || '{}');
        
        const {
            email,
            specialty,
            gameTitle,
            accuracy,
            timeTaken,
            isPerfect,
            reward,
            couponCode,
            couponDiscount,
            timestamp
        } = gameData;

        // Validate required fields
        if (!email || !specialty) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Missing required fields'
                })
            };
        }

        console.log('Submission:', { email, specialty, accuracy });

        // Submit to Google Sheets
        const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK;
        
        if (GOOGLE_SHEETS_WEBHOOK) {
            const sheetData = {
                timestamp: timestamp,
                email: email,
                specialty: specialty,
                game_title: gameTitle,
                accuracy: accuracy,
                time_taken: timeTaken,
                is_perfect: isPerfect,
                reward_product: reward,
                coupon_code: couponCode,
                coupon_discount: couponDiscount,
                submission_id: `ELEM_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            };

            console.log('Sending to Google Sheets...');
            
            const sheetResponse = await axios.post(GOOGLE_SHEETS_WEBHOOK, sheetData, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000,
                validateStatus: (status) => status < 500
            });

            console.log('Google Sheets response:', sheetResponse.data);

            if (!sheetResponse.data || !sheetResponse.data.success) {
                throw new Error('Google Sheets submission failed');
            }
        }

        // Optional: Send to WebEngage
        const WEBENGAGE_LICENSE_CODE = process.env.WEBENGAGE_LICENSE_CODE;
        const WEBENGAGE_API_KEY = process.env.WEBENGAGE_API_KEY;

        if (WEBENGAGE_LICENSE_CODE && WEBENGAGE_API_KEY) {
            try {
                console.log('Sending to WebEngage...');
                
                const webengagePayload = {
                    userId: email,
                    eventName: 'Elements_Game_Completed',
                    eventData: {
                        specialty: specialty,
                        game_title: gameTitle,
                        accuracy: accuracy,
                        time_taken: timeTaken,
                        is_perfect: isPerfect,
                        reward: reward,
                        coupon_code: couponCode
                    }
                };

                const endpoint = `https://api.webengage.com/v1/accounts/${WEBENGAGE_LICENSE_CODE}/events`;
                
                await axios.post(endpoint, webengagePayload, {
                    headers: {
                        'Authorization': `Bearer ${WEBENGAGE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 15000
                });

                console.log('✅ WebEngage event sent');
            } catch (webengageError) {
                console.error('⚠️ WebEngage error:', webengageError.message);
            }
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Game submission successful!',
                data: gameData
            })
        };

    } catch (error) {
        console.error('=== ERROR ===');
        console.error('Error:', error.message);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Submission failed',
                details: error.message
            })
        };
    }
};
