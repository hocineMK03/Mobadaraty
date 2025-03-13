const authServices = require("../services/authServices");
const authjwt = require("../middlewares/authJWT");
const cloudinaryServices=require("../services/cloudinaryServices")
const fs = require("fs");
const path = require("path");
class AuthControllers {
  async handleLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const result=await authServices.login(email, password);
      console.log(result)
      const token = email;
      const accessToken = authjwt.createAccessToken(token);
      const refreshToken = authjwt.createRefreshToken(token);
      res.cookie("data_payload", result.fullName, {
        maxAge: 50 * 60 * 1000,
      });
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 50 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ message: "Logged in successfully" });
      
        
    } catch (error) {
      next(error);
    }
  }

  async handleAssociationRegister(req, res, next) {
    let file = null;
    let filePath = null;
    let uploadedFile = null;  // Declare a variable to store the uploaded file details
  
    try {
      const { email, password, phone, name, locations, CIB } = req.body;
      file = req.file;
      
      if (file) {
        console.log(file);
        
        // Upload the file directly to Cloudinary (in-memory)
        uploadedFile = await cloudinaryServices.uploadStream(file);
  
        // You can use uploadedFile.secure_url or any other response details as needed
        console.log('Uploaded file URL:', uploadedFile.secure_url);
      }
      
      const parsedLocations = Array.isArray(locations) ? locations : JSON.parse(locations);
      const result = await authServices.registerAssociationUser(
        email,
        password,
        phone,
        name,
        parsedLocations,
        CIB,
        uploadedFile ? uploadedFile.secure_url : null // Use the uploaded file URL if it exists
      );
  
      const token = email;
      const accessToken = authjwt.createAccessToken(token);
      const refreshToken = authjwt.createRefreshToken(token);
      res.cookie("data_payload", result.name, { maxAge: 50 * 60 * 1000 });
      res.cookie("access_token", accessToken, { httpOnly: true, maxAge: 50 * 60 * 1000 });
      res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  
      res.status(201).json({ message: "Association registered successfully" });
  
    } catch (error) {
      // If there was an error, delete the uploaded file from Cloudinary if it exists
      if (uploadedFile) {
        try {
          await cloudinaryServices.deleteFile(uploadedFile.public_id); // Delete by public ID
          console.log('Deleted file from Cloudinary');
        } catch (deleteError) {
          console.log('Error deleting file from Cloudinary:', deleteError);
        }
      }
      next(error);  // Pass the error to the next middleware (error handler)
    }
  }
  

  async handleVolunteernRegister(req, res, next) {
    try {
      const {
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
      } = req.body;

      const invitationData = req.invitationData;
      const {
        inviteeEmail,
        inviterEmail,
        specialToken1
      }
      = invitationData;
      const result=await authServices.registerVolunteerUser(
        email,
        password,
        phone,
        fullName,
        dateOfBirth,
        nationalCardNumber,
        skills,
        availability,
        volunteerType,
        specialToken1
      )

      
      const token = email;
      const accessToken = authjwt.createAccessToken(token);
      const refreshToken = authjwt.createRefreshToken(token);
      res.cookie("data_payload", result.fullName, {
        maxAge: 50 * 60 * 1000,
      });
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        maxAge: 50 * 60 * 1000,
      });
      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({ message: "Volunteer registered successfully" });

      // make invitation as accepted

    if(volunteerType==="association_member"){
      

      const invitationServices = require("../services/invitationServices");
      await invitationServices.acceptInvite(inviteeEmail, inviterEmail);
    }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthControllers();
