const jwt = require('jsonwebtoken');
const config = require('../config/config');
const verifyToken = (req, res, next) => {
    try{
        const token = req.cookies['access_token'] 

    
    if (!token) {
        console.log("error")
        const error = new Error('No token provided');
        error.statusCode = 401;
        error.status = 'fail';
        return next(error);
    }

  
    jwt.verify(token, config.accessTokenJWT, (err, decoded) => {
        if (err) {
            const error = new Error('Failed to authenticate token');
            error.statusCode = 403;
            error.status = 'fail';
            return next(error);
        }

     
        req.user = decoded;
        next();
    });
    }
    catch(error){console.log("error", error)
        if (!error.statusCode) {
            error.statusCode = 500;
        }
        throw error;
    }
};

module.exports = verifyToken;