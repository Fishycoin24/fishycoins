const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());

// Replace with your API token
const botToken = '8123439232:AAEZmsL9D5JPfccjcs16gIO3IcQeLrvTaSo';
const bot = new TelegramBot(botToken, { polling: true });

// Mock Database
const users = {}; // { userId: { referrer: referrerId, referrals: [] } }

// API to provide the user ID
app.get('/api/getUserId', (req, res) => {
    // Simulate fetching the logged-in user ID (e.g., from session or JWT)
    const userId = req.query.userId || '12345'; // Replace with actual user logic
    res.json({ userId });
});

// Handle Telegram Bot /start command
bot.onText(/\/start (.+)/, (msg, match) => {
    const referrerId = match[1];
    const userId = msg.from.id;

    if (!users[userId]) {
        users[userId] = { referrer: referrerId, referrals: [] };

        // Add the user to the referrer's referral list
        if (users[referrerId]) {
            users[referrerId].referrals.push(userId);
        }

        bot.sendMessage(
            userId,
            `Welcome! You were referred by User ID: ${referrerId}. Start earning rewards!`
        );
    } else {
        bot.sendMessage(userId, 'You are already registered.');
    }
});

// API to fetch referrals
app.get('/api/getReferrals', (req, res) => {
    const userId = req.query.userId;

    if (!userId || !users[userId]) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { referrals } = users[userId];
    res.json({ referrals });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
