
const volunteerServices = require('../services/volunteerServices');

class VolunteerControllers{


async handleAcceptInvite(req, res, next) {
    try{
        const {associationID,locationID}=req.body;
        const userEmail=req.user.user
      
        res.status(200).json(result);
    }
    catch(error){
        next(error)
    }
}

async handleCreateInvites(req, res, next) {
    try{
        
       const {volunteerID,associationID,locationID}=req.body;
       const result=await volunteerServices.createInvites(volunteerID,associationID,locationID);
         res.status(200).json(result);
    }
    catch(error){
        next(error)
    }
}


async handleGetInvites(req, res, next) {
    try{
       
        const userEmail=req.user.user
        console.log(userEmail)
        const result=await volunteerServices.getInvites(userEmail);
        res.status(200).json(result);
    }
    catch(error){
        next(error)
    }
}
}

module.exports=new VolunteerControllers;