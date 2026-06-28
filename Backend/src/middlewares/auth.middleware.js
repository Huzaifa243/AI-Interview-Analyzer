const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")
// is middleware se check karenge k jo token aa raha h req.cookies.token me se kahi wo blacklisted token to nhi h.


async function authUser(req, res, next) {

    const token = req.cookies.token

    if(!token) {
        return res.status(401).json({
            message: "Token not provided."
        })
    }

    const isTokenBlacklisted = await tokenBlacklistModel.findOne({
        token
    })

    if(isTokenBlacklisted) {
        return res.status(401).json({
            message: "token is invalid."
        })
    }

    try{
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    
    } catch(err) {
        
        return res.status(401).json({
            message: "Invalud token."
        })
    
    }
    

}


module.exports = { authUser }