const admin = require("../config/firebaseConfig");


class NotificationServices{
  
     sendNotification = async (userFCMToken, title, body) => {
        const message = {
            notification: { title, body },
            token: userFCMToken, // Send to specific device
        };
    
        try {
            await admin.messaging().send(message);
            console.log("✅ Notification sent!");
        } catch (error) {
            console.error("❌ Error sending notification:", error);
        }
    };
    
    
    

}
module.exports= new NotificationServices