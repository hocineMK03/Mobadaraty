
const donationServices=require('../services/donationServices')
class DonationControllers{

async handleCreateDonation(req, res, next) {

    try{
const {association,type,amount,method,objectDetails}=req.body;
const userEmail=req.user.user
console.log(userEmail)

await donationServices.createDonation(userEmail, association, type, amount, method, objectDetails)
res.json({message:"Donation created successfully"})
    }

    catch(error){
        next(error)
    }
}

async handleProcessPayment(req, res, next) {
    try{
        const {donationID}=req.body;
        const result=await donationServices.processPayment(donationID)
        res.status(200).json(result)
    }
    catch(error){
        next(error)
    }
}


async handleGetDonation(req, res, next) {

}

async handleGetDonationByAssociation(req, res, next) {

}

async handleGetDonationByUserId(req, res, next) {
    try{
       const theEmail= req.user.user
        const result = await donationServices.getDonationsByUserID(theEmail);
        res.status(200).json({result})
    }
    catch(error){
        next(error)
    }
}

}



module.exports = new DonationControllers;