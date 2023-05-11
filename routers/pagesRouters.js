const {Router} = require('express')

const {
    getHome,
    registerUser,
    loginUser,
    logoutUser,
    profileUser,
    refreshToken
} = require('../controls/pagesControls')

const {protected} = require("../middleware/tokens")

const router = Router()

router.get('/', getHome)

router.post('/api/register', registerUser)
router.post('/api/login', loginUser)
router.post('/api/logout', protected, logoutUser)
router.get('/api/profile', protected, profileUser)
router.post('/api/refresh', protected, refreshToken)


module.exports = router









