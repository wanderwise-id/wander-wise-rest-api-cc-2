const {
  db,
  admin,
  usersRef,
  citiesRef,
  destinationsRef,
  destinationByCityRef } = require('../db/firebase');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllUsers = async (req, res) => {
  res.send('get all users route');
};

const getUser = async (req, res) => {
  res.send('get user route');
};

const createUser = async (req, res) => {
  res.send('create user route');
};

const deleteUser = async (req, res) => {
  res.send('delete user route');
};

const updateUser = async (req, res) => {
  res.send('update user route');
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  deleteUser,
  updateUser,
};