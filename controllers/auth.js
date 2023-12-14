const {firebase} = require('../db/firebase');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const errorHandlerMiddleware = require('../middleware/error-handler');

const login = async (req, res) => {
  res.send('login route');
};

const logout = async (req, res) => {
  res.send('logout route');
};

const register = async (req, res) => {
  res.send('register route');
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
