const { CheckIn } = require("../models/CheckIn");

class CheckInServices {
  async scanQRCode(volunteerID, associationID) {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    // Find the last check-in for today
    const lastCheckIn = await CheckIn.findOne({
        userId: volunteerID,
        associationId: associationID,
        checkInTime: {
            $gte: new Date(today),
            $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
        }
    }).sort({ checkInTime: -1 });

    
    if (lastCheckIn && !lastCheckIn.checkOutTime) {
        lastCheckIn.checkOutTime = now;
        await lastCheckIn.save();

        // give him poinrs
        const authservices = require("./authServices");
        await authservices.awardDonorPoints(volunteerID, 10);
        return { message: "Check-out successful!", checkOutTime: now };
    }

   
    const checkInsToday = await CheckIn.countDocuments({
        userId: volunteerID,
        associationId: associationID,
        checkInTime: { $gte: new Date(today), $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)) }
    });

    if (checkInsToday >= 2) {
        throw new Error("Max 2 check-ins per day allowed for this association.");
    }

  
    if (lastCheckIn) {
        const diffHours = (now - lastCheckIn.checkInTime) / (1000 * 60 * 60);
        if (diffHours < 6) {
            throw new Error("You must wait at least 6 hours between check-ins.");
        }
    }

   
    const newCheckIn = new CheckIn({ userId:volunteerID, associationId:associationID });
    await newCheckIn.save();

    return { message: "Check-in successful!", checkInTime: now };

}
}

module.exports = new CheckInServices();
