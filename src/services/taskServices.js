
class TaskServices {
    async createTask(title, description, locationID, date, skills, taskType, theEmail) {
        try {
           
            const authServices = require("./authServices");
            const findUser = await authServices.findUserByEmailAndPhone(theEmail, null);
            
            if (!findUser.found || findUser.data.role !== "association") {
                throw new Error("Association not found or invalid role");
            }

            const association = findUser.data;
            
            // Find the location inside the association
            const location = association.locations.find(loc =>String( loc._id) === locationID);
            if (!location) {
                console.log(locationID)
                throw new Error("Location not found");
            }

            // Create a new task
            const newTask = {
                title,
                description,
                dueDate: date,
                requiredSkills: skills,
                taskType,
                status: "pending",
                assignedTo: []
            };

            // Push the task to the location's tasks array
            location.tasks.push(newTask);

            // Save the association with the updated task
            await association.save();

            return newTask;
        } catch (error) {
            console.error("Error creating task:", error.message);
            throw new Error(error.message);
        }
    }

   
    async assignTask(taskID, volunteerEmail, associationEmail) {
        const authServices = require("./authServices");
        try {
            // 🔹 Step 1: Find the association
            const associationResult = await authServices.findUserByEmailAndPhone(associationEmail, null);
            if (!associationResult.found || associationResult.data.role !== "association") {
                throw new Error("Association not found or invalid role");
            }
            const association = associationResult.data;

            // 🔹 Step 2: Find the volunteer
            const volunteerResult = await authServices.findUserByEmailAndPhone(volunteerEmail, null);
            if (!volunteerResult.found || volunteerResult.data.role !== "volunteer") {
               const error = new Error("Volunteer not found or invalid role");
                error.statusCode = 404;
                throw error;
            }
            
            if(!volunteerResult.data.associationId && !volunteerResult.data.assignedLocation ){
                const error = new Error("Volunteer not part of the association");
                error.statusCode = 403;
                throw error;
            }
            
            const volunteer = volunteerResult.data;

            // 🔹 Step 3: Check if the volunteer is part of the association
            if(volunteer.volunteerType && volunteer.associationId.toString() !== association._id.toString()){
                const error = new Error("Volunteer not part of the association");
                error.statusCode = 403;
                throw error;
            }

            let task = null;
            let locationID=null;
for (const location of association.locations) {
    task = location.tasks.find(t => t._id.toString() === taskID);
    
    if (task) {  // If task is found, break the loop
        console.log("Found Task:", String(task._id), "=", taskID);
        locationID=location._id;
        console.log("Location ID:", locationID);
        break;
    }
}

           
            if (!task) {
               const error = new Error("Task not found");
                error.statusCode = 404;
                throw error;
            }

            // 🔹 Step 5: Assign the volunteer to the task
            if (!task.assignedTo.includes(volunteer._id)) {
                task.assignedTo.push(volunteer._id);
                //add in the array of assigned volunteers automatically
                await authServices.assignLocation(volunteerEmail,String(locationID) ,associationEmail)
            } else {
                console.log("erere")
               const error = new Error("Volunteer already assigned to the task");
                error.statusCode = 400;
                throw error;
            }

            // 🔹 Step 6: Save the updated association with the assigned task
            await association.save();

            return { success: true, message: "Volunteer assigned to the task" };
        } catch (error) {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            throw error;
        }
    }

    async getTasksByLocation(locationID, theEmail) {
        try {
            console.log("Location ID:", locationID);
            const authServices = require("./authServices");
            const findUser = await authServices.findUserByEmailAndPhone(theEmail, null);
            if (!findUser.found || findUser.data.role !== "association") {
                throw new Error("Association not found or invalid role");
            }

            const association = findUser.data;
            const location = association.locations.find(loc => String(loc._id) === locationID);
            if (!location) {
              const error = new Error("Location not found");
                error.statusCode = 404;
                throw error;
            }

            return {
                locationID: location._id,
                location: location.address,
                coordinates: location.coordinates,
                tasks: location.tasks
                
            }
        } catch (error) {
            console.error("Error getting tasks by location:", error.message);
            throw new Error(error.message);
        }
    }


    
}

module.exports = new TaskServices
