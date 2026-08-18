# 🚀 Premium Portfolio Website

A professional, modern, and fully responsive portfolio website built with React, featuring stunning animations and a premium design aesthetic.

## ✨ Features

- **Premium Design**: Clean, professional, and modern UI with a SaaS-inspired aesthetic
- **Fully Responsive**: Optimized for all devices from mobile to desktop
- **Smooth Animations**: Powered by Framer Motion for fluid, professional animations
- **Multiple Sections**:
  - Hero section with animated role transitions
  - About section with statistics
  - Skills showcase with technology grid
  - Work experience timeline
  - Featured projects portfolio
  - Contact section with multiple ways to connect
  - Professional footer with navigation

## 🛠️ Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Framer Motion**: Professional animations
- **Lucide React**: Beautiful, consistent icons
- **Inter Font**: Premium typography
- **CSS3**: Custom styling with CSS variables

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 🎨 Customization

### Update Personal Information

1. **Contact Information** (App.jsx):
   - Update email: `harshill.barot@gmail.com`
   - Update phone: `+91 98765 43210`
   - Update location: `Gujarat, India`

2. **Social Media Links** (App.jsx):
   - GitHub: `https://github.com/harshilbarot`
   - LinkedIn: `https://linkedin.com/in/harshil-barot-211513353`
   - Twitter: `https://twitter.com/harshilbarot`
   - Instagram: `https://instagram.com/harshilbarot`
   - WhatsApp: `https://wa.me/919876543210`

3. **Profile Images**:
   - Replace images in `/src` folder
   - Update imports in `App.jsx`

4. **Resume**:
   - Add your resume PDF to `/public` folder
   - Update link in navigation and contact section

### Customize Content

1. **Hero Section**:
   - Update roles array for rotating titles
   - Modify hero description text

2. **About Section**:
   - Update statistics (Years, Projects, Technologies)
   - Modify about text paragraphs

3. **Skills Section**:
   - Add/remove skills in the skills array
   - Update additional technologies in tech tags

4. **Experience Section**:
   - Update experiences array with your work history
   - Add achievements for each position

5. **Projects**:
   - Connect to your backend API or
   - Update mock data in fetchProjects function

### Color Scheme

Customize colors in `App.css`:
```css
:root {
  --primary: #4f46e5;
  --secondary: #0ea5e9;
  --dark: #0f172a;
  --text-primary: #f8fafc;
  /* ... more variables */
}
```

## 📱 Sections Overview

### 1. Navigation
- Fixed navigation with smooth scroll
- Active section highlighting
- Resume download button
- Responsive design

### 2. Hero Section
- Animated entrance with strip effect
- Photo showcase
- Rotating role titles
- Call-to-action buttons

### 3. About Section
- Personal introduction
- Achievement statistics
- Interactive hover effects
- Professional image showcase

### 4. Skills Section
- Technology grid with icons
- Category-based organization
- Additional technologies tags
- Hover animations

### 5. Experience Section
- Timeline layout
- Position details
- Key achievements
- Company information

### 6. Projects Section
- Grid layout for projects
- Image/placeholder support
- Technology tags
- Live links and overlays

### 7. Contact Section
- Multiple contact methods
- Social media links
- Email and phone details
- Call-to-action box

### 8. Footer
- Brand information
- Quick navigation links
- Social links
- Copyright information

## 🎯 Performance Optimizations

- Lazy loading animations
- Optimized images
- Minimal dependencies
- Efficient CSS
- Fast build times with Vite

## 🔧 Development

```bash
# Install dependencies
npm install

# Run development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Project Structure

```
client/
├── public/
│   └── Harshil_Barot_Resume.pdf
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── [images]
├── index.html
├── package.json
└── vite.config.js
```

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Harshil Barot**
- Email: harshill.barot@gmail.com
- LinkedIn: [harshil-barot-211513353](https://linkedin.com/in/harshil-barot-211513353)
- GitHub: [harshilbarot](https://github.com/harshilbarot)

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Animations by [Framer Motion](https://www.framer.com/motion/)
- Font by [Google Fonts - Inter](https://fonts.google.com/specimen/Inter)

---

Made with ❤️ by Harshil Barot
