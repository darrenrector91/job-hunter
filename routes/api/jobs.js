const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Job = require('../../models/Job');
const User = require('../../models/User');

// @route    POST api/jobs
// @desc     Create a job
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('position', 'Position is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newJob = new Job({
        user: req.user.id,
        company: req.body.company,
        contact_name: req.body.contact_name,
        position: req.body.position,
        email: req.body.email,
        status: req.body.status,
        notes: req.body.notes,
        filename: req.body.filename
      });

      const job = await newJob.save();

      res.json(job);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/jobs
// @desc     Get all jobs
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ date: -1 });
    res.json(jobs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/jobs/:id
// @desc     Get job by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/jobs/:id
// @desc     Delete a job
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ msg: 'Job not found' });
    }

    // Check user
    if (job.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await job.remove();

    res.json({ msg: 'Job removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Job not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
