require('dotenv').config();
const config={
    port:process.env.PORT || 5000,
    mongoUrl:process.env.mongoUrl || "",
    accessTokenJWT:process.env.ACCESS_JWT_SECRET || "",
    refreshTokenJWT:process.env.REFRESH_JWT_SECRET || "",
    smtpGmail:process.env.SMTP_GMAIL || "",
    smtpAppPassword:process.env.SMTP_APP_PASSWORD || "",
    frontendURL:process.env.FRONTEND_URL || ""
}

module.exports=config;