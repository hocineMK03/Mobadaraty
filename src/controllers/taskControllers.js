
const taskServices= require('../services/taskServices');
class TaskControllers{


    async createTask(req, res, next) {
            try{
                const { title, description,placeName, date,  skills, taskType } = req.body;
                const theEmail = req.user.user
               
                const result = await taskServices.createTask(title, description, placeName, date, skills, taskType, theEmail);
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
}

module.exports = new TaskControllers;