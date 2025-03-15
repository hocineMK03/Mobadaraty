

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

}

module.exports=new VolunteerControllers;