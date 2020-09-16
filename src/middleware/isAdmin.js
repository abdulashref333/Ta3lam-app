module.exports = (req, res, next) =>{
    if(!req.user.isAdmin){
        return res.status(400).send({
            error:'you are not Admin User'
        })
    }
    next();
}
