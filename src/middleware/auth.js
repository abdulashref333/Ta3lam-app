const authe = (req, res, next) =>{
    //get the token from request header ..
    //validat jwt with secret key useing verify
    //find user from data base useing payload that saved in jwt

    req.user = user;
    
    next();
}
module.exports = authe ;