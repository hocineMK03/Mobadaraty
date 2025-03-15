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


async getInvites(userEmail){
    try{
        const auhtServices=require('./authServices')
        const findUser=await auhtServices.findUserByEmailAndPhone(userEmail,null)
        if(!findUser && !findUser.found){
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        const result=await authServices.getUserbyID("67d4c5dca1f55e61aa451467")
        console.log(result)
        const offers = await Offer.find({
            volunteerId: findUser.data._id,
            status: "pending",
          });

          

          return offers;
    }
    catch(error){
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