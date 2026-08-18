const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProject = async (req, res) => {
  const project = new Project({
    title: req.body.title,
    description: req.body.description,
    technologies: req.body.technologies,
    githubUrl: req.body.githubUrl,
    liveUrl: req.body.liveUrl,
    image: req.body.image,
    brandLogo: req.body.brandLogo,
    brandName: req.body.brandName,
    tags: req.body.tags,
    features: req.body.features,
    backgroundColor: req.body.backgroundColor,
    status: req.body.status
  });

  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { getProjects, createProject };
