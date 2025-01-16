const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const apiToken = "8123439232:AAEZmsL9D5JPfccjcs16gIO3IcQeLrvTaSo";
const botUrl = `https://api.telegram.org/bot${apiToken}`;

app.use(bodyParser.json());

// Save referral data
let referrals = {};

// Handle updates from Telegram Bot
app.post('/webhook', async (req, res) => {
    const update = req.body;

    if (update.message && update.message.text.startsWith('/start')) {
        const referrerId = update.message.text.split(' ')[1]; // Extract referrer ID
        const referredUserId = update.message.chat.id;

        if (referrerId && referredUserId) {
            if (!referrals[referrerId]) {
                referrals[referrerId] = [];
            }

            // Add the referred user to the referrer's list
            referrals[referrerId].push(referredUserId);

            // Notify the referrer
            await axios.post(`${botUrl}/sendMessage`, {
                chat_id: referrerId,
                text: `You referred a new user: ${referredUserId}`
            });

            console.log(`Referral tracked: ${referrerId} -> ${referredUserId}`);
        }
    }

    res.sendStatus(200);
});

// Fetch referrals for a specific user
app.get('/referrals/:userId', (req, res) => {
    const userId = req.params.userId;
    const userReferrals = referrals[userId] || [];
    res.json({ referrals: userReferrals });
});

// Set webhook
app.get('/setWebhook', async (req, res) => {
    try {
        const webhookUrl = "https://t.me/fishycoin_bot/webhook"; // Replace with your server URL
        const response = await axios.post(`${botUrl}/setWebhook`, {
            url: webhookUrl
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
