const QRCode = require("qrcode");


const generateVolunteerQR =async (volunteerID)=>{
    try {
        
        const qrCodeURL = await QRCode.toDataURL(volunteerID);
        return qrCodeURL; 
    } catch (error) {
        console.error("Error generating QR Code:", error);
        throw new Error("QR Code generation failed");
    }
}
module.exports = { generateVolunteerQR };
