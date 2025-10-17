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

    try {
        const data = JSON.parse(event.body || '{}');
        const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK;

        if (!GOOGLE_SHEETS_WEBHOOK) {
            throw new Error('Google Sheets webhook not configured');
        }

        const response = await axios.post(GOOGLE_SHEETS_WEBHOOK, data, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 30000
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Data logged successfully',
                data: response.data
            })
        };

    } catch (error) {
        console.error('Google Sheets error:', error.message);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
