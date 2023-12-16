const { firebase } = require('../db/firebase');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const errorHandlerMiddleware = require('../middleware/error-handler');

const login = async (req, res) => {
  const { email, password } = req.body;
  const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
  const user = userCredential.user;
  const idToken = await user.getIdToken();

  req.session.uid = user.uid;
  req.session.email = user.email;
  // req.session.token = user.refreshToken;
  req.session.token = idToken;
  // req.session.accesstoken = user.accessToken;

  res.status(StatusCodes.OK).json({ 
    error: false,
    msg: 'Login successful',
    body: {
      uid: user.uid, 
      name: user.displayName,
      email: user.email, 
      token: idToken, 
      accesstoken: user.accessToken,
      // user,
    },
   });
};

const logout = async (req, res) => {
  firebase.auth().signOut()
  .then(() => {
    req.session.destroy();
    res.status(StatusCodes.OK).json({ 
      error: false,
      msg: 'Logout successful',
    });
  });
};

const register = async (req, res) => {
  const { email, password, username } = req.body;
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    await user.updateProfile({ displayName: username });
    req.session.uid = user.uid;

    res.status(StatusCodes.CREATED).json({
      error: false, 
      msg: 'User created',
      body: {
        uid: user.uid,
        email: user.email,
        username: user.displayName,
        },
      });
  } catch (error) {
    throw new BadRequestError('Invalid signup credentials');
  }
};

const forgotPassword = async (req, res) => {
  res.send('forgot password route');
};

const resetPassword = async (req, res) => {
  res.send('reset password route');
};

const updatePassword = async (req, res) => {
  res.send('update password route');
};

module.exports = {
  login,
  logout,
  register,
  forgotPassword,
  resetPassword,
  updatePassword,
};
