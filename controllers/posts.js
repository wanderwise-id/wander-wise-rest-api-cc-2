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
  const uploadFile = require('../middleware/upload');
  const fs = require('fs');
  const { use } = require('passport');
  const cloudinary = require('cloudinary').v2;


const getAllPosts = async (req, res) => {
  
  const snapshot = await postsRef.get();
  const posts = [];
  snapshot.forEach((doc) => {
    posts.push({ id: doc.id, ...doc.data()});
  });

  res.status(StatusCodes.OK).json({
    nbHits: posts.length,
    error: false,
    msg: 'Success get all posts',
    body: {
      posts,
    },
  })
};

const getAllPostsUser = async (req, res) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  try {
  const snapshot = await postsRef.where("userId", "==", userId).get();
  
  const post = [];
  snapshot.forEach((doc) => {
    post.push({ id: doc.id, ...doc.data()});
  });
    
  // .collection("posts")
  // .where("userId", "==", "hibQpDqjSgOJNcJ2c429rJ3uyP33")
  
  res.status(StatusCodes.OK).json({
    nbHits: post.length,
    error: false,
    msg: 'Success get all posts',
    body: {
      post,
    }
  });
  } catch (error) {
  // //    // Handle the error appropriately
    console.error(error);
    res.status(StatusCodes.NOT_FOUND).json({
      error: true,
      msg: error.message,
      body: null,
    });
  }
  
};

const getPost = async (req, res) => {
  

  
  const { postId } = req.params;
  try {
    const postDoc = await postsRef.doc(postId).get();

    if( !postDoc.exists ) {
      throw new NotFoundError(`Post with id ${postId} not found`);
    }

    const postData = postDoc.data();
    const post = {
      id: postDoc.id,
      ...postData,
    };

    res.status(StatusCodes.OK).json({
      nbHits: post.length,
      error: false,
      msg: `Success get post with ID ${postId}`,
      body: {
        post,
      },
    });
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: true,
      msg: error.message,
      body: null,
    });
  }

}

const createPostText = async (req, res) => {
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


const createPost = async (req, res) => {

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  try {
    await uploadFile(req, res);
    
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    
    // Delete the file from local storage after successful upload to Cloudinary
    fs.unlinkSync(req.file.path);
    
    const {
      title,
      caption,
    } = req.body;

    if (!title || !caption) {
      return res.status(400).json({ error: true, msg: 'Title and caption are required.' });
    }

    const postdoc = postsRef.doc();

    
      const post = {
        userId: userId,
        idPost: postdoc.id,
        title: title,
        image: result.secure_url,
        caption: caption,
        createdAt: admin.firestore.Timestamp.fromDate(new Date()),
        // Add other post properties here
      };
      
    await postdoc.set(post);
      
    delete post.userId;
    res.status(StatusCodes.CREATED).json({
      error: false,
      msg: 'Post created',
      body: {
        post,
      },
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size cannot be larger than 2MB!",
      });
    }

    res.status(500).send({
      message: `Could not upload the file. ${err}`,
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
  getAllPostsUser,
  getPost,
  createPost,
  createPostText,
  deletePost,
  updatePost,
};