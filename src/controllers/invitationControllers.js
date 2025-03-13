
const invitationServices = require("../services/invitationServices");
class InvitationControllers {
 async sendInvite(req, res, next) {
    try{
    const { email } = req.body;
    const theEmail = req.user.user
     
    const result = await invitationServices.sendInvite(email, theEmail);


    const emailServices = require("../services/emailServices");
    

    res.json({ message: result});
    await emailServices.sendInvitationnEmail(email,theEmail,result);
    }
    catch(error){
      next(error)
    }
 }
}

module.exports = new InvitationControllers();
