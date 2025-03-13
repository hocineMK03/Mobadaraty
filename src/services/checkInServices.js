
const {CheckIn} = require('../models/CheckIn')

class CheckInServices{


    async scanQRCode(volunteerID,associationID){
try{
    let checkIn = await CheckIn.findOne({
        volunteerId: volunteerID,
        associationId: associationID,
        checkOutTime: null, // No check-out means they are still checked in
    });

    if (!checkIn) {
        // No existing check-in found, create a new check-in
        checkIn = new CheckIn({
            volunteerId: volunteerID,
        associationId: associationID,
            checkInTime: new Date(),
        });
        await checkIn.save();
        return { message: "Check-in successful" };
    } else {
        // Existing check-in found, update with check-out time
        checkIn.checkOutTime = new Date();
        await checkIn.save();
        return { message: "Check-out successful" };
    }
}
catch(error){
    if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
}
    }

}

module.exports = new CheckInServices