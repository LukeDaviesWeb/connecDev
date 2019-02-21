//create / edit user profile: ie location bio education

// @route   GET api/profile/test
// @desc    Tests post route
// @access  public
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: 'profile works!' }));

module.exports = router;
