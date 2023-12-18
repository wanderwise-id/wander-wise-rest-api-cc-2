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
    post.push({ 
      id: doc.id, ...doc.data(),
    });
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
    // upload file process to req.file
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Delete the file from local storage after successful upload to Cloudinary
    fs.unlinkSync(req.file.path);
    //end upload file process to req.file
    
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
    // console.log(err);

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
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;
  
  const { postId } = req.params;
  const postDoc = await postsRef.doc(postId);
  const post = await postDoc.get();
  if (!post.exists) {
    throw new NotFoundError(`Post with ID ${postId} not found`);
  }
  await postDoc.delete();
  res.status(StatusCodes.OK).json({
    error: false,
    msg: `Post with ID ${postId} deleted`,
    body: null,
  });
};

// const updatePost = async (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   const decodedToken = await admin.auth().verifyIdToken(token);
//   const userId = decodedToken.uid;

//   const { postId } = req.params;
//   try {
//     const postDoc = await postsRef.doc(postId).get();

//     if( !postDoc.exists ) {
//       throw new NotFoundError(`Post with id ${postId} not found`);
//     }

//     const postData = postDoc.data();
//     const post = {
//       id: postDoc.id,
//       ...postData,
//     };

//     res.status(StatusCodes.OK).json({
//       nbHits: post.length,
//       error: false,
//       msg: `Success get post with ID ${postId}`,
//       body: {
//         post,
//       },
//     });
//   } catch (error) {
//     res.status(StatusCodes.NOT_FOUND).json({
//       error: true,
//       msg: error.message,
//       body: null,
//     });
//   }
// };


const updatePost = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = await admin.auth().verifyIdToken(token);
  const userId = decodedToken.uid;

  const { postId } = req.params;
  try {
    // upload file process to req.file
    await uploadFile(req, res);
    if (req.file == undefined) {
      return res.status(400).send({ message: "Please upload a file!" });
    }
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    // Delete the file from local storage after successful upload to Cloudinary
    fs.unlinkSync(req.file.path);
    //end upload file process to req.file

    const { 
      title, 
      caption 
    } = req.body;
    // console.log(req.body);
    
    
    const postDoc = postsRef.doc(postId);
    const post = await postDoc.get();
    const postData = post.data();
    
    
    if (!post.exists) {
      throw new NotFoundError(`Post with ID ${postId} not found`);
    }
    
    const tmpTitle = postData.title;
    const tmpCaption = postData.caption;
    const tmpImage = postData.image;
    
    // check request body is empty or not
    
    
    const newData = {
      title: title || tmpTitle,
      caption: caption || tmpCaption,
      image: result.secure_url || tmpImage,
    };
    
    // console.log(newData);
    
    try {
      await postDoc.update(newData);
    } catch (error) {
      res.status(StatusCodes.NOT_FOUND).json({ msg: error.message });
    }
  
    res.status(StatusCodes.OK).json({
      error: false,
      msg: `Post with ID ${postId} successfully updated`,
      body: {
        post: {
          title: newData.title,
          caption: newData.caption,
          image: newData.image,
        },
      },
    });

  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({
      error: true,
      msg: error.message,
      body: null,
    });
  }
  
};



// const updatePost = async (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];
//   const decodedToken = await admin.auth().verifyIdToken(token);
//   const userId = decodedToken.uid;

//   const { postId } = req.params;
//   const { title, caption } = req.body;

//   try {
//     const postDoc = await postsRef.doc(postId).get();

//     if (!postDoc.exists) {
//       throw new NotFoundError(`Post with id ${postId} not found`);
//     }

//     const postData = postDoc.data();

//     // Check if the user making the request is the owner of the post
//     if (postData.userId !== userId) {
//       return res.status(StatusCodes.FORBIDDEN).json({
//         error: true,
//         msg: 'Permission denied. You are not the owner of this post.',
//         body: null,
//       });
//     }

//     // Upload new image if provided
//     let newImageUrl = postData.image;
//     if (req.file) {
//       await cloudinary.uploader.destroy(postData.public_id); // Remove old image from Cloudinary
//       const newImageResult = await cloudinary.uploader.upload(req.file.path);
//       newImageUrl = newImageResult.secure_url;
//       fs.unlinkSync(req.file.path); // Delete the file from local storage
//     }

//     // Update the post data, including the image URL
//     await postsRef.doc(postId).update({
//       title: title || postData.title,
//       caption: caption || postData.caption,
//       image: newImageUrl,
//       updatedAt: admin.firestore.Timestamp.fromDate(new Date()),
//       // Add other fields to update here
//     });

//     const updatedPostDoc = await postsRef.doc(postId).get();
//     const updatedPostData = updatedPostDoc.data();

//     res.status(StatusCodes.OK).json({
//       error: false,
//       msg: `Post with ID ${postId} successfully updated`,
//       body: {
//         post: {
//           id: updatedPostDoc.id,
//           ...updatedPostData,
//         },
//       },
//     });
//   } catch (error) {
//     res.status(StatusCodes.NOT_FOUND).json({
//       error: true,
//       msg: error.message,
//       body: null,
//     });
//   }
// };


module.exports = {
  getAllPosts,
  getAllPostsUser,
  getPost,
  createPost,
  createPostText,
  deletePost,
  updatePost,
};