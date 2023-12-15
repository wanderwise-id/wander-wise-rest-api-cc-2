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


const getAllPosts = async (req, res) => {
  
};

const getPost = async (req, res) => {
  res.send('get post route');
};

const createPost = async (req, res) => {
  try {
    const { uid } = req.session;

    if (!uid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: true,
        msg: 'Authentication invalid',
        body: null,
      });
    }

    const userRef = usersRef.doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: true,
        msg: 'User not found',
        body: null,
      });
    }

    const userData = userDoc.data();
    const { username } = userData;

    const newPost = {
      title: req.body.title,
      image: req.body.image,
      description: req.body.description,
      location: req.body.location,
      username,
      userId: uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const postRef = await db.collection('posts').add(newPost);
    const postDoc = await postRef.get();
    const postData = postDoc.data();

    const post = {
      id: postDoc.id,
      ...postData,
    };

    res.status(StatusCodes.CREATED).json({
      error: false,
      msg: 'Success create new post',
      body: {
        post,
      },
    });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: true,
      msg: 'Internal Server Error',
      body: null,
    });
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