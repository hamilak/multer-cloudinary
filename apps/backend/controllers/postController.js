const PostModel = require('../models/post');
const UserModel = require('../models/user')
const { uploadImage } = require('../services/cloudinaryService');
const fs = require('fs');

// create new post
exports.create = async(req, res) => {
    try {
        console.log(req.body)
        const { content } = req.body
        const userId = req.user._id

        console.log(content, userId)

        let imageUrl = ''
        if(req.file) {
            console.log(req.file)
            const transformationOptions = [
                {quality: 'auto', fetch_format: 'auto'}
            ]
            const uploadResult = await uploadImage(req.file.path, transformationOptions)
            imageUrl = uploadResult.secure_url
            fs.unlink(req.file.path, (err) => {
                if(err) {
                    console.log('Error deleting temporary file', err)
                }
            })
        }
        const post = new PostModel({
            userId,
            content,
            image: imageUrl
        })

        await post.save()
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send({ message: 'An error occured while creating post', error: error.message })
    }
}

// get posts created by user
exports.getUserPosts = async(req, res) => {
    try {
        const userId = req.params.id;
        const posts = await PostModel.find({ userId }).sort({ createdAt: -1 }).populate('userId', 'username profilePicture')
        res.status(200).send(posts)
    } catch (error) {
        res.status(400).send({ message: 'An error occured while getting user posts', error: error.message })
    }
}

// get posts of user followers
exports.getPostsOfFollowers = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId).populate('followers', '_id');
        const followersIds = user.followers.map(follower => follower._id);

        const posts = await PostModel.find({ userId: { $in: followersIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture')

        res.status(200).send(posts);
    } catch (error) {
        res.status(400).send({ message: 'Error fetching followers posts', error: error.message });
    }
};


// get posts of user following
exports.getPostsOfFollowing = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId).populate('following', '_id');
        const followingIds = user.following.map(following => following._id);

        const posts = await PostModel.find({ userId: { $in: followingIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture')

        res.status(200).send(posts);
    } catch (error) {
        res.status(400).send({ message: 'Error fetching following posts', error: error.message });
    }
};


// get all posts of user follower and following
exports.getAllPostsOfFollowersAndFollowing = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await UserModel.findById(userId)
            .populate('followers', '_id')
            .populate('following', '_id');

        const followersIds = user.followers.map(follower => follower._id);
        const followingIds = user.following.map(following => following._id);

        const combinedIds = [...new Set([...followersIds, ...followingIds])];

        const posts = await PostModel.find({ userId: { $in: combinedIds } })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture')

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(400).send({ message: 'An error occurred while getting posts', error: error.message });
    }
};

// get all posts without logged in user's posts
exports.getAllPosts = async(req, res) => {
    try {
        const userId = req.user._id;
        const posts = await PostModel.find({ userId: { $ne: userId } })  // Exclude logged-in user
            .populate('userId', 'username profilePicture');

        res.status(200).send(posts);
    } catch (error) {
        res.status(400).send({ message: 'An error occurred while getting posts', error: error.message });
    }
};

// like post
exports.likePost = async(req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await PostModel.findById(postId);
        if (!post.likes.includes(userId)) {
            post.likes.push(userId);
            await post.save();
        }

        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: 'Error liking post', error: error.message });
    }
}

// unlike post
exports.unlikePost = async(req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;

        const post = await PostModel.findById(postId);
        if (post.likes.includes(userId)) {
            post.likes.filter(like => like.toString() !== userId.toString())
            await post.save();
        }

        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: 'Error liking post', error: error.message });
    }
}

// comment on post
exports.comment = async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.id;
        const { content } = req.body;

        const post = await PostModel.findById(postId);
        const newComment = {
            userId,
            content,
            createdAt: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(200).send(post);
    } catch (error) {
        res.status(400).send({ message: 'Error adding comment', error: error.message });
    }
};

// remove comment
