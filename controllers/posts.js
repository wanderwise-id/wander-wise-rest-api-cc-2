const { 
  db, 
  admin, 
  usersRef, 
  citiesRef, 
  destinationsRef, 
  destinationByCityRef } = require('../db/firebase');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');


const getAllPosts = async (req, res) => {
  res.send('get all posts route');
};

const getPost = async (req, res) => {
  res.send('get post route');
};

const createPost = async (req, res) => {
  res.send('create post route');
};

const deletePost = async (req, res) => {
  res.send('delete post route');
};

const updatePost = async (req, res) => {
  res.send('update post route');
};

module.exports = {
  getAllPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
};