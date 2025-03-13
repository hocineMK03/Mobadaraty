const QRCode = require("qrcode");

const config = require("../config/config");

const generateVolunteerQR = async (volunteerID, associationID) => {
    try {
        console.log("Generating QR Code for volunteer:", volunteerID);
        console.log("Generating QR Code for association:", associationID);
        const urlqr = `${config.backEndURL}/api/v1/checkin/scan/${volunteerID}/${associationID}`;

        // Generate the QR Code from the new URL
        const qrCodeURL = await QRCode.toDataURL(urlqr);

        return qrCodeURL;
    } catch (error) {
        console.error("Error generating QR Code:", error);
        throw new Error("QR Code generation failed");
    }
};

module.exports = { generateVolunteerQR };
