
const checkInServices = require("../services/checkInServices");
class CheckInController {
 

    async handleScanQR(req, res, next) {
        try {
            const { volunteerID,associationID } = req.params
            const result = await checkInServices.scanQRCode(volunteerID,associationID);

            res.send(result.message);
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}


module.exports = new CheckInController;