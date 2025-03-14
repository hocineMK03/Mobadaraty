
const taskServices= require('../services/taskServices');
class TaskControllers{


    async createTask(req, res, next) {
            try{
                const { title, description,locationID, date,  skills, taskType } = req.body;
                const theEmail = req.user.user
               
                const result = await taskServices.createTask(title, description, locationID, date, skills, taskType, theEmail);
                res.status(201).json(result);
            }
            catch(error){
              
                next(error);
            }
    }



    async assignTask(req, res, next) {
        try{
            const { taskID, volunteerEmail } = req.body;
            const theEmail = req.user.user

            
            const result = await taskServices.assignTask(taskID, volunteerEmail, theEmail);
            res.status(200).json(result);
        }
        catch(error){
            next(error);
        }
    }

    async handleGetTasksByLocation(req, res, next) {
        try{
            const { locationID } = req.params;
            const theEmail = req.user.user
           
            const result = await taskServices.getTasksByLocation(locationID, theEmail);
            res.status(200).json(result);
        }
        catch(error){
            next(error);
        }
    }

    async handleGetTaskByID(req, res, next) {
        try{
            const { taskID } = req.params;
            const theEmail = req.user.user
           
            const result = await taskServices.getTaskByID(taskID, theEmail);
            res.status(200).json(result);
        }
        catch(error){
            next(error);
        }
    }
}

module.exports = new TaskControllers;