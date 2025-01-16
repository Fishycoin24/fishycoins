import { getReferrals, getReferrer, saveReferral } from '@/lib/storage';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { userId, referrerId } = req.body;

        if (!userId || !referrerId) {
            return res.status(400).json({ error: 'Missing userId or referrerId' });
        }

        saveReferral(userId, referrerId);
        return res.status(200).json({ success: true });
    }

    if (req.method === 'GET') {
        const userId = req.query.userId;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const referrals = getReferrals(userId);
        const referrer = getReferrer(userId);

        return res.status(200).json({ referrals, referrer });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
