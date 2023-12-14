const express = require('express');
const router = express.Router();

const { 
  register, 
  login, 
  logout, 
  forgotPassword, 
  resetPassword, 
  updatePassword, 
} = require('../controllers/auth');

router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/register').post(register);
router.route('/forgotpassword').post(forgotPassword);
router.route('/resetpassword/:resettoken').patch(resetPassword);
router.route('/updatepassword').patch(updatePassword);

module.exports = router;