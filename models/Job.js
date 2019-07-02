const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  company: {
    type: String,
    required: true
  },
  contact_name: {
    type: String
  },
  email: {
    type: String
  },
  position: {
    type: String,
    required: true
  },
  notes: {
    type: String
  },
  status: {
    type: String
  },
  filename: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Job = mongoose.model('job', JobSchema);
