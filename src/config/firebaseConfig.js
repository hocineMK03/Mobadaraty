const admin = require("firebase-admin");
const serviceAccount = require("../config/mobadaraty-5e379-firebase-adminsdk-fbsvc-e430f6d56e.json"); // Update path if needed

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
