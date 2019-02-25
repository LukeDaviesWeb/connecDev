const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Get models
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

//Get Validation function
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get Posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ noPostFound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get Post by ID
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err =>
      res.status(404).json({ noPostFound: 'No post found with that ID' })
    );
});

// @route   POST api/posts
// @desc    Create post
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // check validation
    if (!isValid) {
      //any errors send 400 with error object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    DELETE post
// @access  Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        //check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notAuthorized: 'User not authorized' });
        }

        //delete post
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(() => res.status(404).json({ postNotFound: 'No post found' }));
      });
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyLiked: 'User already liked this post' });
          }

          //Add user id to likes array
          post.likes.push({ user: req.user.id });

          //save to the database
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
    });
  }
);

// @route   POST api/posts/unlike/:id
// @desc    Unlike post
// @access  Private

router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notLiked: 'You have not yet liked this post' });
          }

          //Get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          //Splice it out of the array
          post.likes.splice(removeIndex, 1);

          //Save
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No Post found' }));
    });
  }
);

module.exports = router;
