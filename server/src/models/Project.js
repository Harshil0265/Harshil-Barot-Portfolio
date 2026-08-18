const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [String],
  githubUrl: String,
  liveUrl: String,
  image: String,
  brandLogo: String,
  brandName: String,
  tags: [String],
  features: [{
    icon: String,
    title: String,
    description: String
  }],
  backgroundColor: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', projectSchema);
