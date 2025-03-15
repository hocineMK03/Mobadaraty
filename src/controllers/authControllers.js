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
      res.cookie("data_payload", result.name, {
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
      const { email, password, phone, name, locations, CIB,local_location ,type,description} = req.body;
      
   
  
      
      const result = await authServices.registerAssociationUser(
        email,
        password,
        phone,
        name,
      
        CIB,
        type,
        description
        
      );
  
      const token = email;
      const accessToken = authjwt.createAccessToken(token);
      const refreshToken = authjwt.createRefreshToken(token);
      res.cookie("data_payload", result.name, { maxAge: 50 * 60 * 1000 });
      res.cookie("access_token", accessToken, { httpOnly: true, maxAge: 50 * 60 * 1000 });
      res.cookie("refresh_token", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  
      res.status(201).json({ message: "Association registered successfully" });


      let parsedLocations = Array.isArray(locations) ? locations : JSON.parse(locations);
      /*  const parsedLocalLocation = Array.isArray(local_location) ? local_location : JSON.parse(local_location);
  */ const parsedLocalLocation =null
 
      // retrive coordinates for each location using antoehr service
       const {getCoordinates} = require("../utils/getCoordinates");
       for (let location of parsedLocations) {
         const coordinates = await getCoordinates(location.address);
 
         
         location.coordinates = [coordinates.lat, coordinates.lon];
 
 
       }
       //update the association with the locations
       await authServices.updateAssociationLocations(result.user, parsedLocations);


      file = req.file;
      
      if (file) {
        console.log(file);
        
        // Upload the file directly to Cloudinary (in-memory)
        uploadedFile = await cloudinaryServices.uploadStream(file);
  
        // You can use uploadedFile.secure_url or any other response details as needed
        console.log('Uploaded file URL:', uploadedFile.secure_url);
        await authServices.updateAssociateDocs(result.user, uploadedFile.secure_url);
      }
      

    } catch (error) {
    
      if (uploadedFile) {
        try {
          await cloudinaryServices.deleteFile(uploadedFile.public_id); 
          console.log('Deleted file from Cloudinary');
        } catch (deleteError) {
          console.log('Error deleting file from Cloudinary:', deleteError);
        }
      }

     
      next(error);  
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
        location
      } = req.body;
      
      const invitationServices = require("../services/invitationServices");
      let inviterEmail = null;
      let specialToken1 = null;
      let inviteeEmail = null;
      
      if (volunteerType === "association_member") {
        const invitationData = req.invitationData;
        inviterEmail = invitationData.inviterEmail;
        specialToken1 = invitationData.specialToken1;
        inviteeEmail = invitationData.inviteeEmail;
        
        await invitationServices.checkInvValidity(email, inviterEmail, specialToken1);
      }

      if(volunteerType==="association_member"){
        await invitationServices.checkInvValidity(email, inviterEmail, specialToken1);
      }
      let parsedLocation={};
      const {getCoordinates} = require("../utils/getCoordinates");
      const coordinates = await getCoordinates(location.address);
      parsedLocation.address=location
      parsedLocation.coordinates = [coordinates.lat, coordinates.lon];

     
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
        specialToken1,
        parsedLocation,
       
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
      

     
      await invitationServices.acceptInvite(inviteeEmail, inviterEmail);
    }
    } catch (error) {
     
      next(error);
    }
  }


  async handleAssignLocation(req, res, next) {
    try {
      const { email, locationID } = req.body;
      const theEmail = req.user.user
      const result = await authServices.assignLocation(email, locationID,theEmail);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }




  async handleUpdateNeeds(req, res, next) {
    try {
      const {locationID,skills,requiredVolunteers} = req.body;
      const theEmail = req.user.user
      const result = await authServices.updateNeeds(locationID,skills,requiredVolunteers,theEmail);
      res.json({ message: "Needs updated successfully",result });

     
    } catch (error) {
      next(error);
    }
  }


  async handleGetLocations(req, res, next) {
    try{
      const result=await authServices.getLocations(false);
      res.json(result);
    }
    catch(error){
      next(error);
    }
  }

  /* for ML */

  async getVolunteerData(req, res, next) {
    try{
      const result=await authServices.getUnassignedVolunteers();
      res.json(result);
    }
    catch(error){
      next(error);
    }
  }

  async getLocations(req, res, next) {
    try{
      const result=await authServices.getLocations(true);
      res.json(result);
    }
    catch(error){
      next(error);
    }
  }


  async getDataML(req, res, next) {
    try{
      const result=await authServices.dataML()
      res.json(result);
    }
    catch(error){
      next(error);
    }
  }
}

module.exports = new AuthControllers();


