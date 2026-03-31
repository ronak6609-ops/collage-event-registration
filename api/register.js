const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase Admin only once
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, event } = req.body;

  if (!name || !event) {
    return res.status(400).json({ error: 'Name and event are required' });
  }

  try {
    await db.collection('registrations').add({
      name,
      event,
      registeredAt: new Date().toISOString(),
    });

    return res.status(200).json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save registration' });
  }
};