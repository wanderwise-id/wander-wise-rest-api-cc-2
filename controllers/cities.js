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
  const snapshot = await citiesRef.get();
  const cities = [];
  snapshot.forEach((doc) => {
    cities.push({ id: doc.id, ...doc.data()});
  });
  res.status(StatusCodes.OK).json({ 
    error: false,
    msg: 'Success get all cities',
    body: {
      cities
    },
  });
};

const getCity = async (req, res) => {
  res.send('get city route');
};

const createCity = async (req, res) => {
const { 
  name,
  capital,
  country,
  description,
  image,
  area,
  location={
    latitude,
    longitude,
  },
 } = req.body;

// console.log(req.body);

const citydoc = citiesRef.doc();
// const { latitude, longitude } = location;

const city = {
  idCity  : citydoc.id,
  name: name,
  capital: capital,
  country: country,
  description: description,
  image: image,
  area: area,
  location: new admin.firestore.GeoPoint(location.latitude, location.longitude),
};


// console.log(city);
await citydoc.set(city);
res.status(StatusCodes.CREATED).json({ 
  error: false,
  msg: 'Success create city',
  body: {
    city,
    }
  });
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

