require('dotenv').config();
const config={
    port:process.env.PORT || 5000,
    mongoUrl:process.env.mongoUrl || "",
    accessTokenJWT:process.env.ACCESS_JWT_SECRET || "",
    refreshTokenJWT:process.env.REFRESH_JWT_SECRET || "",
    smtpGmail:process.env.SMTP_GMAIL || "",
    smtpAppPassword:process.env.SMTP_APP_PASSWORD || "",
    frontendURL:process.env.FRONTEND_URL || "",
    firebaseServerKey:process.env.FIREBASE_SERVER_KEY || "",
    cloudinaryCloudName:process.env.CLOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey:process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret:process.env.CLOUDINARY_API_SECRET || "",
}

module.exports=config;