//users authentication passposrt etc

// @route   GET api/users/test
// @desc    Tests post route
// @access  public
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: 'users works!' }));

module.exports = router;
