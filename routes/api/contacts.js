const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');

const Contact = require('../../models/Contacts');
const User = require('../../models/User');

// @route    POST api/contacts
// @desc     Create a contact
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('contact_name', 'Contact name is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
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

      const newContact = new Contact({
        user: req.user.id,
        company: req.body.company,
        contact_name: req.body.contact_name,
        position: req.body.position,
        phone: req.body.phone,
        email: req.body.email,
        notes: req.body.notes
      });

      const contact = await newContact.save();

      res.json(contact);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    GET api/contacts
// @desc     Get all contacts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/contacts/:id
// @desc     Get contact by ID
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    PUT api/contacts/:id
// @desc     Update a contact
// @access   Private

// CURRENTLY NOT WORKING
// RETURNS UPDATED CONTACT BUT NOT ACTUALLY UPDATED

router.put('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    console.log(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    // Check user
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await contact.save();

    res.json({ msg: 'Contact updated' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route    DELETE api/contacts/:id
// @desc     Delete a contact
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ msg: 'Contact not found' });
    }

    // Check user
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await contact.remove();

    res.json({ msg: 'Contact removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Contact not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;
