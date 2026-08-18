# Harshil's Portfolio - MERN Stack

A full-stack personal portfolio built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Project Structure

```
harshil-portfolio/
├── client/          # React frontend (Vite)
├── server/          # Express backend
└── README.md
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB (local or MongoDB Atlas)

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the `server/` directory:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/portfolio
NODE_ENV=development
```

## Features
- Project showcase with CRUD operations
- Responsive design
- RESTful API
- Modern UI with React
