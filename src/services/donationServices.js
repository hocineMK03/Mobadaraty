const {Donation} = require("../models/Donation");
const { v4: uuidv4 } = require("uuid");
const {mongoose}= require('../config/db');
class DonationServices{


    async createDonation(userEmail, association, type, amount, method, objectDetails) {
        try {
            const authServices = require("./authServices");
            const donor = await authServices.findUserByEmailAndPhone(userEmail, null);
            if (!donor.found) {
                const error = new Error("User not found");
                error.statusCode = 404;
                throw error;
            }
             // cehck if the assossiation exist
            const findAssociation = await authServices.findAssociationByAssociationID(association);
            if (!findAssociation.found) {
                const error = new Error("Association not found");
                error.statusCode = 404;
                throw error;
            }
            let donationData = {
                donor: donor.data._id,
                association: findAssociation.data._id,
                type,
                status: "pending",
            };
    
            if (type === "money") {
                if (!amount || amount <= 0) {
                    const error = new Error("Invalid donation amount");
                    error.statusCode = 400;
                    throw error;
                }
                donationData.amount = amount;
                donationData.method = method;
            } else if (type === "object") {
                if (!objectDetails?.name || !objectDetails?.quantity) {
                    const error = new Error("Invalid object details");
                    error.statusCode = 400;
                    throw error;
                }
                donationData.objectDetails = objectDetails;
            } else {
                throw new Error("Invalid donation type");
            }
            
            const donation = new Donation(donationData);
            await donation.save();
            const points= amount* 0.1;

            await authServices.awardDonorPoints(donor.data._id, points);
            return donation;
        } catch (error) {
            console.error("Error in createDonation:", error.message);
            throw new Error(error.message || "Server error");
        }
    }
    

    async processPayment(donationID) {
        /* const session = await mongoose.startSession();
        session.startTransaction(); */
    
        try {
            /* const donation = await Donation.findById(donationID).session(session); */
            const donation = await Donation.findById(donationID)
            if (!donation) {
                const error = new Error("Donation not found");
                error.statusCode = 404;
                throw error;
            }
    
            if (donation.status === "completed") {
                return { message: "Donation already completed", donation };
            }
            if(donation.type === "object"){
                const error = new Error("Object donations do not require payment processing");
                error.statusCode = 400;
                throw error;
            }
    
            let isSuccess = true;
    
            if (donation.type === "money") {
                isSuccess = Math.random() > 0.2; 
            }
    
            donation.status = isSuccess ? "completed" : "failed";
    
            if (donation.type === "money" && isSuccess) {
                donation.transactionHistory.push({
                    transactionId: uuidv4(),
                    timestamp: new Date(),
                    status: donation.status,
                });
            }
            
            donation.save();
            /* await donation.save({ session });
            await session.commitTransaction();
            session.endSession(); */
    
            return { message: isSuccess ? "Donation successful" : "Payment failed", donation };
        } catch (error) {
            /* await session.abortTransaction();
            session.endSession(); */
            console.error("Error in processPayment:", error.message);
            throw new Error(error.message || "Payment processing failed");
        }
    }
    

    async getDonationsByUserID(userEmail){

        try{
            const authServices=require('./authServices')
            const user = await authServices.findUserByEmailAndPhone(userEmail,null);
            if(!user.found){
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            const donations = await Donation.find({ donor: user.data._id })
            .populate("association", "name email") // Include association details
            .lean(); // Convert MongoDB objects to plain JSON

        // Format the response to include transaction history only for money donations
        return donations.map((donation) => ({
            _id: donation._id,
            association: donation.association,
            type: donation.type,
            status: donation.status,
            createdAt: donation.createdAt,
            ...(donation.type === "money"
                ? {
                      amount: donation.amount,
                      method: donation.method,
                      transactionHistory: donation.transactionHistory || [],
                  }
                : {
                      objectDetails: donation.objectDetails,
                  }),
        }));
        }
        catch(error){
            if (!error.statusCode) {
                error.statusCode = 500;
              }
              throw error;
        }

    }


}

module.exports = new DonationServices;