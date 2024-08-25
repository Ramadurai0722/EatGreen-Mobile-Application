const router = require('express').Router();
const { register, login, getAllUsers, getProfile,updateProfile } = require('../Controller/userController'); 

// Route Definitions
router.post('/register', register); 
router.post('/login', login);      
router.get('/getAll', getAllUsers); 
router.get('/profile', getProfile); 
router.put('/update-profile', updateProfile);

module.exports = router;