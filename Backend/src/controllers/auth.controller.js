const userModel = require("../models/user.model")
// yaha pe userModel is liye require karte h k jo bhi user ki details h jese k username, email, password sab usi models k zarye aata h na to wo sab details jab controller me aayegi tabhi hum un details ka use kar k user ko register kara sakte h na.
const bcrypt = require("bcryptjs")
// yaha pe bcryptjs ko is liye require kiya kyu k user jo password dega, yaha pe use hame pehle hash me convert karna padega, us k baad hi hum user ko register karate h hamare database me, kyu k ye controller user ko register karne wala controller h is me sab user ki details aa rhi h req.body se.
const jwt = require("jsonwebtoken")
// ye is liye require kiya taake jo new user create hua h usko ek unique id de sake, taake wo jab bhi hamari application pe aaye to us token se wo registered user identify ho sake. 
const tokenBlacklistModel = require("../models/blacklist.model")
// agar koi user loggout hota h to us ka jo personal token create hua tha use hum blacklist me daal dete h, taake kisi bhi tarike se koi or unauthorisely us token ka use na kar sake.


/**
 * @name registerUserController
 * @description register a new user, expects username, email, password in request.body
 * @access Public
 */
async function  registerUserController(req, res) {
    
    const { username, email, password } = req.body

    if(!username || !email || !password) {
        return res.status(400).json({
            message: "Username, Email and Password are required."
        })
    }

    const isUserAlreadyExists = await userModel.findOne({
        $or: [ { username }, { email } ]
    }) // is se check karenge k jo bhi user register kar raha h kahi wo user already exist to nhi karta h, agar karta h to ye function hame bolega k is email se ya is username se ek user exist karta h, to hum us new user ko bolenge k is email se ya is username se ek user already exist karta h.

    if(isUserAlreadyExists) {
        return res.status(400).json({
            message: "Account already exists with this username or email address."
        })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    ) // is tokne ko cookies me bhi set karna h

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
async function loginUserController(req, res) {
    
    const { email, password } = req.body 

    const user = await userModel.findOne({ email }) // login request me hum email or password hi maangenge, email se check karege k jo email request me aaya h us email se user exist karta h ya nhi, agar karta h to uska password bhi check hoga sahi h ya nhi, agar dono sahi to user login ho jayega, per agar us email se user exist hi nhi karta h to hum bolenge k create your account first.

    if(!user) {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid) {
        return res.status(400).json({
            message: "Invalid email or password."
        })
    }

    const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("token", token)

    res.status(200).json({
        message: "User loggedIn Successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }

    })
}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist.
 * @access public
 */
async function logoutUserController(req, res) {
    const token = req.cookies.token

    if(token) {
        await tokenBlacklistModel.create({ token })
    }

    res.clearCookie("token")

    res.status(200).json({
        message: "User logged out Successfully."
    })
}

/**
 * @name getMeController
 * @description get me current logged in user details.
 * @access private
 */
async function getMeController (req, res) {

    const user = await userModel.findById(req.user.id)

    res.status(200).json({
        message: "User details fetched successfully.",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}



module.exports = { registerUserController, loginUserController, logoutUserController, getMeController }

