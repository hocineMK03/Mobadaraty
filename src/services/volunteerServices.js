const {Offer}= require('../models/Offer');
const authServices = require('./authServices');

class VolunteerServices{


async acceptInvite(associationID,locationID,userEmail){

        try{
            const auhtServices=require('./authServices')
            const findUser=await auhtServices.findUserByEmail(userEmail)
            if(!findUser){
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }
            const offer = await Offer.findOne({
                associationId: associationID,
                locationId: locationID,
                volunteerId: findUser._id,
              });
              if (!offer) {
                const error = new Error("Offer not found");
                error.statusCode = 404;
                throw error;
              }
              offer.accepted = true;
              await offer.save();
              return offer;
            
        }
        catch(error){
            if (!error.statusCode) {
                error.statusCode = 500;
              }
                throw error;
        }
}


async getInvites(userEmail) {
  try {
      const authServices = require('./authServices');
      const findUser = await authServices.findUserByEmailAndPhone(userEmail, null);

      if (!findUser || !findUser.found) {
          const error = new Error("User not found");
          error.statusCode = 404;
          throw error;
      }

      // Get pending offers for the volunteer
      const offers = await Offer.find({
          volunteerId: findUser.data._id,
          status: "pending",
      }).lean(); // ✅ Use `.lean()` for better performance

      // Get all location data
      const locationData = await authServices.getLocations(false);

      // Merge data by matching `associationId` and `locationId`
      const mergedData = offers.map(offer => {
          const matchedLocation = locationData.find(loc =>
              loc.associationId.toString() === offer.associationId.toString() &&
              loc.locationId.toString() === offer.locationId.toString()
          );
          console.log(matchedLocation);
          return {
              _id: offer._id,
              associationId: offer.associationId,
              locationId: offer.locationId,
              skills: matchedLocation?.skills || [], // Default to empty array if not found
              coordinates: matchedLocation?.coordinates || [],
              name: matchedLocation.name || "Unknown",
              address: matchedLocation.address || "No address available",
              description: matchedLocation.description || "No description",
              type: matchedLocation.type || "N/A",
          };
      });

      return mergedData;

  } catch (error) {
      if (!error.statusCode) {
          error.statusCode = 500;
      }
      throw error;
  }
}




// for etstign purposes

async  createInvites(volunteerID,associationID,locationID){
    try{
        const offer = new Offer({
            volunteerId: volunteerID,
            associationId: associationID,
            locationId: locationID,
          });
          const result = await offer.save();
          return result;
    }
    catch(error){
        throw error
    }

}
}

module.exports= new VolunteerServices