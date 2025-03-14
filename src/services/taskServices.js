
class TaskServices {
    async createTask(title, description, placeName, date, skills, taskType, theEmail) {
        try {
            // Find the association user
            console.log(placeName)
            const authServices = require("./authServices");
            const findUser = await authServices.findUserByEmailAndPhone(theEmail, null);
            
            if (!findUser.found || findUser.data.role !== "association") {
                throw new Error("Association not found or invalid role");
            }

            const association = findUser.data;

            // Find the location inside the association
            const location = association.locations.find(loc => loc.placeName === placeName);
            if (!location) {
                console.log(association)
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

   
    async assignTask(taskId, volunteerEmail, associationEmail) {
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
                throw new Error("Volunteer not found or invalid role");
            }
            const volunteer = volunteerResult.data;

            // 🔹 Step 3: Check if the volunteer is part of the association
            if(volunteer.volunteerType && volunteer.associationId.toString() !== association._id.toString()){
                throw new Error("Volunteer is not part of the association");
            }

            // 🔹 Step 4: Find the task within the association's locations
            let task = null;

            for (const location of association.locations) {
                task = location.tasks.find(t => t._id.equals(taskId));
                if (task) break;
            }
            console.log(association.locations,associationEmail,volunteerEmail)
            if (!task) {
                throw new Error("Task not found");
            }

            // 🔹 Step 5: Assign the volunteer to the task
            if (!task.assignedTo.includes(volunteer._id)) {
                task.assignedTo.push(volunteer._id);
            } else {
                throw new Error("Volunteer is already assigned to this task");
            }

            // 🔹 Step 6: Save the updated association with the assigned task
            await association.save();

            return { success: true, message: "Volunteer assigned to the task" };
        } catch (error) {
            console.error("Error in assignTask:", error);
            return { success: false, message: error.message };
        }
    }
}

module.exports = new TaskServices
