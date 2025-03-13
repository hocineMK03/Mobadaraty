
const {Invitation} = require('../models/Invitation');

class invitationServices{

async sendInvite(email,theEmail){
    try{
        const authServices = require('./authServices');
        const existingInvite = await authServices.findUserByEmailAndPhone(email,null);
        if (existingInvite.found) {
          const error = new Error("This email has already been used.");
          error.statusCode = 400;
          throw error;
        }
        const findUser = await authServices.findUserByEmailAndPhone(theEmail,null);
        if(findUser.found){

            //check if there is the exact invite 
            const checkInvite = await Invitation.findOne({email:email,invitedBy:findUser.data._id});
            if(checkInvite && checkInvite.status === 'pending'){
                const error = new Error('Invite already sent');
                error.statusCode = 400;
                throw error;
            }
            else if (checkInvite && checkInvite.status === 'accepted'){
                const error = new Error('Invite already accepted');
                error.statusCode = 400;
                throw error;
            }
            // cehck if others already invited him
            const checkOtherInvites = await Invitation.findOne
            ({email:email,status:'pending'});
            if(checkOtherInvites){
                const error = new Error('Invite already sent by someone else');
                error.statusCode = 400;
                throw error;
            }
            const createInvite= await Invitation.create({
                email:email,
                invitedBy:findUser.data._id
            });

           if(!createInvite){
                const error = new Error('Failed to send invite');
                error.statusCode = 500;
                throw error;
           }

           return findUser.data.specialToken;
        }
        else{
           const error = new Error('User not found');
              error.statusCode = 404;
                throw error;
        }
        
    }

    catch(error){
        if (!error.statusCode) {
            error.statusCode = 500;
          }
          throw error;
    }
}

async acceptInvite(email, theEmail) {
    try {
        const authServices = require('./authServices');
        const findUser = await authServices.findUserByEmailAndPhone(theEmail, null);
        
        if (!findUser.found) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }

        // Check if the invitation exists before updating
        const findInv = await Invitation.updateOne(
            { email: email, invitedBy: findUser.data._id },
            { $set: { status: 'accepted' } }
        );

        console.log(findUser.data._id)

        if (findInv.matchedCount === 0) {
            const error = new Error("No pending invitation found for this email.");
            error.statusCode = 404;
            throw error;
        }

        if (findInv.modifiedCount === 0) {
            const error = new Error("Invite status was already accepted.");
            error.statusCode = 400;
            throw error;
        }

        return { message: "Invite accepted successfully" };
    } catch (error) {
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
}

}


module.exports = new invitationServices;