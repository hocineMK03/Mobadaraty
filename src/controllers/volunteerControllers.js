

class VolunteerControllers{


async handleAcceptInvite(req, res, next) {
    try{
        const {associationID}=req.body;
        const userEmail=req.user.user
        
    }
    catch(error){
        next(error)
    }
}

}

module.exports=new VolunteerControllers;