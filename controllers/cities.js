const { 
  db, 
  admin, 
  usersRef, 
  citiesRef, 
  destinationsRef, 
  destinationByCityRef } = require('../db/firebase');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


const getAllCities = async (req, res) => {
  res.send('get all cities route');
};

const getCity = async (req, res) => {
  res.send('get city route');
};

const createCity = async (req, res) => {
  res.send('create city route');
};

const deleteCity = async (req, res) => {
  res.send('delete city route');
};

const updateCity = async (req, res) => {
  res.send('update city route');
};

module.exports = {
  getAllCities,
  getCity,
  createCity,
  deleteCity,
  updateCity,
}

