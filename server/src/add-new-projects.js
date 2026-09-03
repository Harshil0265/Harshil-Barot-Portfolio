require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

const newProjects = [
  {
    title: 'AN Uniforms',
    description: 'Enterprise-grade full-stack B2B uniform management platform built with Next.js and MERN stack. Features automated quotation generation, multi-industry inquiry management, real-time order tracking, inventory control, and comprehensive admin dashboard for operational excellence.',
    technologies: ['Next.js', 'MongoDB', 'Node.js', 'Express.js'],
    githubUrl: '#',
    liveUrl: '#', // Add live URL when available
    image: '/AN_Uniforms.png',
    brandLogo: '/AN_Uniforms.png',
    brandName: 'AN Uniforms',
    tags: ['Next.js', 'MongoDB', 'Node.js', 'Express.js'],
    features: [
      { 
        icon: 'Code', 
        title: 'Full-Stack MERN', 
        description: 'Next.js + MongoDB + Express + Node.js' 
      },
      { 
        icon: 'ShoppingCart', 
        title: 'Quote Automation', 
        description: 'AI-powered quotation generation system' 
      },
      { 
        icon: 'Package', 
        title: 'Order Management', 
        description: 'Real-time tracking & inventory control' 
      },
      { 
        icon: 'BarChart', 
        title: 'Admin Dashboard', 
        description: 'Comprehensive business analytics' 
      }
    ],
    backgroundColor: '#1e3a8a',
    status: 'Completed',
    createdAt: new Date('2026-09-03T10:00:00')
  },
  {
    title: 'Ripper',
    description: 'High-performance full-stack media downloader platform built with Next.js and MERN architecture. Enables seamless MP3/MP4 downloads from YouTube, Instagram, and TikTok with FFmpeg integration, format conversion, and quality optimization for superior user experience.',
    technologies: ['Next.js', 'MongoDB', 'Node.js', 'FFmpeg'],
    githubUrl: '#',
    liveUrl: '#', // Add live URL when available
    image: '/Ripper.png',
    brandLogo: '/Ripper.png',
    brandName: 'Ripper',
    tags: ['Next.js', 'MongoDB', 'Node.js', 'FFmpeg'],
    features: [
      { 
        icon: 'Code', 
        title: 'Full-Stack Platform', 
        description: 'Next.js + MongoDB + Node.js + Express' 
      },
      { 
        icon: 'Smartphone', 
        title: 'Multi-Platform', 
        description: 'YouTube, Instagram & TikTok support' 
      },
      { 
        icon: 'FileAudio', 
        title: 'Format Conversion', 
        description: 'High-quality MP3/MP4 processing' 
      },
      { 
        icon: 'Download', 
        title: 'Download Manager', 
        description: 'Queue management & history tracking' 
      }
    ],
    backgroundColor: '#dc2626',
    status: 'Completed',
    createdAt: new Date('2026-09-03T11:00:00')
  }
];

async function addProjects() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if projects already exist
    for (const projectData of newProjects) {
      const existingProject = await Project.findOne({ title: projectData.title });
      
      if (existingProject) {
        console.log(`Project "${projectData.title}" already exists. Skipping...`);
        continue;
      }

      const project = new Project(projectData);
      await project.save();
      console.log(`✓ Added project: ${projectData.title}`);
    }

    console.log('\n✓ All projects processed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding projects:', error);
    process.exit(1);
  }
}

addProjects();
