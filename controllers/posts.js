const { 
  db, 
  admin, 
  usersRef, 
  citiesRef, 
  destinationsRef, 
  destinationByCityRef,
  postsRef } = require('../db/firebase');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { post } = require('../routes/upload');


const getAllPosts = async (req, res) => {
  res.send('get all posts route');
};

const getPost = async (req, res) => {
  res.send('get post route');
};

const createPost = async (req, res) => {
const userId = req.session.uid; // Get UID from Firebase auth middleware
const { 
  title, 
  image, 
  caption 
} = req.body;

const postdoc = postsRef.doc();

try {
  const post = {
    userId: userId,
    idPost: postdoc.id,
    title: title,
    image: image,
    caption: caption,
    createdAt: admin.firestore.Timestamp.fromDate(new Date()),
    // Add other post properties here
  };

    await postdoc.set(post);
    res.status(StatusCodes.CREATED).json({
      error: false,
      msg: 'Post created',
      body: {
        post,
      },
    });
  } catch (error) {
    throw new BadRequestError(`Error creating post: ${error}`);
  }
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