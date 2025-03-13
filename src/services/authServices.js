const { User, AssociationUser, VolunteerUser } = require("../models/User");

const passwordutils = require("../utils/passwordUtils");
class AuthServices {
  
  async generateSpecialToken() {

  }
  

  async awardDonorPoints(donorID, points) {
    try {
      const donor = await VolunteerUser.findById(donorID).exec();
      if (!donor) {
        const error = new Error("Donor not found");
        error.statusCode = 404;
        throw error;
      }
      donor.points += points;
      await donor.save();
      return donor;
    } catch (error) {
      console.error("Error in awardDonorPoints:", error.message);
      throw new Error(error.message || "Server error");
    }
  }

  async findUserByEmailAndPhone(email, phone) {
    try {
      const query = [];
  
      if (email) query.push({ email: email });
      if (phone) query.push({ phone: phone });
  
      const findUser = await User.findOne({ $or: query }).exec();
  
      if (!findUser) {
        return { found: false, data: null };
      }
      return { found: true, data: findUser };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }
  
  async findAssociationByAssociationID(associationID) {
    try {
      const association = await AssociationUser.findById(associationID).exec();
      if (!association) {
        return { found: false, data: null };
      }
      return { found: true, data: association };
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }
  
  async findAssociationBySpecialToken(specialToken) {
    try{
      const association = await AssociationUser.findOne({
        specialToken: specialToken,
      }).exec();
      if (!association) {
        return { found: false, data: null };
      }
      return { found: true, data: association };
    }
    catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }
  async registerVolunteerUser(
    email,
    password,
    phone,
    fullName,
    dateOfBirth,
    nationalCardNumber,
    skills,
    availability,
    volunteerType,
    specialToken,
    location
  ) {
    try {
let association;
if(volunteerType==="association_member" && !specialToken){
  const error = new Error("Association volunteer must have a special link");
  error.statusCode = 400;
  throw error;
}
else  if(volunteerType==="association_member" && specialToken){
association=await this.findAssociationBySpecialToken(specialToken);
if(!association.found){
  const error = new Error("Association not found");
  error.statusCode = 400;
  throw error;
}
}



      const findUser = await this.findUserByEmailAndPhone(email,phone);
      if (findUser.found) {
        const error = new Error("Email or phone already taken");
        error.statusCode = 400;
        throw error;
      }
      const hashedPassword = await passwordutils.hashPassword(password);

      
      
    
      
      const volunteerUser = new VolunteerUser({
        email,
        password: hashedPassword,
        phone,
        fullName,
        dateOfBirth,
        nationalCardNumber,
        skills,
        availability,
        volunteerType,
        associationId: association?association.data._id:null,
        location
       
      });
      const result=await volunteerUser.save();
   
     if(volunteerType==="association_member"){
       // generate qrcode
       const userID= result._id;
       const {generateVolunteerQR}=require('../utils/generateVolunteerQR')
       const qr=await generateVolunteerQR(String(userID),String(association.data._id))
       console.log(qr)
       await VolunteerUser.findByIdAndUpdate
       (userID,{qrCode:qr})
     }

      return{fullName:fullName, email:email};
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }


  async updateAssociateDocs(associationUser, legalDocument) {
    try {
      // Ensure the legalDocument is valid
      if (!legalDocument || legalDocument.length === 0) {
        const error = new Error('Legal document cannot be empty');
        error.statusCode = 400; // Bad Request
        throw error;
      }
  
      // Update the legalDocument for the associationUser
      const updatedUser = await AssociationUser.findByIdAndUpdate(
        associationUser._id,
        { legalDocument,
          is_valid: true 
         },
        { new: true } 
      );
  
      if (!updatedUser) {
        const error = new Error('Association user not found');
        error.statusCode = 404; // Not Found
        throw error;
      }
  
      return updatedUser; // Return the updated document
  
    } catch (error) {
      // If an error occurs, make sure we set the status code correctly
      if (!error.statusCode) {
        error.statusCode = 500; // Internal Server Error by default
      }
      throw error; // Re-throw the error to be caught by the global error handler
    }
  }
  
  async registerAssociationUser(
    email,
    password,
    phone,
    name,
    locations,
    CIB,
    local_location
  ) {
    try {
      if (!Array.isArray(locations)) {
        const error = new Error("Locations must be an array");
        error.statusCode = 400;
        throw error;
      }

      //check if email si taken

      const findUser = await this.findUserByEmailAndPhone(email,phone);
      if (findUser.found) {
        const error = new Error("Email or phone already taken");
        error.statusCode = 400;
        throw error;
      }

      const hashedPassword = await passwordutils.hashPassword(password);

      const randomgenerated="random"+name+"generated";
      const associationUser = new AssociationUser({
        email,
        password: hashedPassword,
        phone,
        name,
        locations,
        CIB,
        local_location,
        specialToken: randomgenerated
      });
      
      await associationUser.save();
      return{name:name, email:email,user:associationUser};
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }


  async login(email, password) {
    if (!email || !password) {
      const error = new Error("Please enter all fields");
      error.statusCode = 400;
      throw error;
    }
    try {
      const findUser = await this.findUserByEmailAndPhone(email,null);
      if (!findUser.found) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
      }
     

      const isMatch = await passwordutils.comparedPasswords(
        password,
        findUser.data.password
      );
      if (!isMatch) {
        const error = new Error("password incorrect");
        error.statusCode = 401;
        throw error;
      }
      
      return { fullName: findUser.data.fullName, email: findUser.data.email,userID:findUser.data._id };
    } catch (error) {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      throw error;
    }
  }
}

module.exports = new AuthServices;
