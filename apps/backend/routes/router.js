const express = require('express');
const route = express.Router();
const upload = require('../config/multerConfig');
const { unless, authenticateJWT } = require('../middleware/authenticateJwt');
 
// apply authenticatejwt globally except some routes
route.use(unless(['/auth/login', '/user'], authenticateJWT))

// controllers
const postController = require('../controllers/postController');

//upload.single('profilePicture'), 

// post routes
route.post('/post', upload.single('image'), postController.create)
route.get('/posts', postController.getAllPosts)
route.get('/posts/all', postController.getAllPostsOfFollowersAndFollowing)
route.get('/posts/followers', postController.getPostsOfFollowers)
route.get('/posts/following', postController.getPostsOfFollowing)
route.get('/posts/:id', postController.getUserPosts)


module.exports = route;