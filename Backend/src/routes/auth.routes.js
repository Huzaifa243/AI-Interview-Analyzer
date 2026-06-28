const { Router } = require("express")
const authController = require("../controllers/auth.controller")
const authMiddleware = require("../middlewares/auth.middleware")


const authRouter = Router()


/**
 *  @route POST /api/auth/register
 * @description Register a new user
 * @access Public                        
 */

authRouter.post("/register", authController.registerUserController)
// yaha pe sirf user ko register karane ki api banti h per jo is api pe hona wala poora logic hota h wo controllers file k andar auth.controller.js me hota h. yaha pe mene us auth.controller.js file ko authController naam se require kiya h, jesa k uper wali line me dikh raha h.



/**
 * @route POST /api/auth/login
 * @description login user with email and password
 * @access P8ublic 
 */
authRouter.post("/login", authController.loginUserController)
// yaha per sirf user ko login karane ki api bani h per is api pe hone wala poora logic "auth.controller.js" k andar "loginUserController" me likha h



/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add token in the blacklist
 * @access Public
 */
authRouter.get("/logout",authController.logoutUserController)
// ye api banai gai h user ko logout karane k liye.


/**
 * @route GET /api/auth/get-me
 * @description get the current logged in user details
 * @access private
 */
authRouter.get("/get-me", authMiddleware.authUser, authController.getMeController)

module.exports = authRouter