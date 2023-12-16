const express = require('express');
const router = express.Router();
const uploadFile = require('../middleware/upload');

const {
  getAllPosts,
  getAllPostsUser,
  getPost,
  createPost,
  createPostText,
  deletePost,
  updatePost,
} = require('../controllers/posts');

router.route('/home').get(getAllPosts);
router.route('/').get(getAllPostsUser).post(createPost);
router.route('/uploadpost').post(createPostText);
router.route('/:postId').get(getPost).patch(updatePost).delete(deletePost);

module.exports = router;