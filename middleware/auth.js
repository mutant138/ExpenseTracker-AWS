const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticate = (req,res,next)=>{
    try {
        const token = req.header('Authorization')
        //console.log(token)
        const user = jwt.verify(token, 'secretkeyformyproject1380')
        console.log('User>>>' ,user.userId)
        User.findByPk(user.userId).then(user=>{
            req.user =user; // copying the respected user to the next function via req
            next()
        }).catch(err => {throw new Error (err)})
        
    } catch (error) {
        console.log(error)
        return res.status(401).json({success : false})
    }
}

module.exports = {
    authenticate
}