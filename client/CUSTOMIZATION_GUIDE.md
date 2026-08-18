# 🎨 Customization Guide

## Quick Start Checklist

Follow these steps to personalize your portfolio:

### 1️⃣ Personal Information (5 minutes)

**File: `src/App.jsx`**

#### Update Name and Title
```javascript
// Line ~100: Update hero section
<h1 className="hero-name">Your Name</h1>

// Line ~60: Update rotating roles
const roles = [
  'Your Role 1',
  'Your Role 2',
  'Your Role 3',
  'Your Role 4'
]
```

#### Update Contact Details
```javascript
// Line ~400: Email
<a href="mailto:your.email@gmail.com">your.email@gmail.com</a>

// Line ~410: Phone
<a href="tel:+1234567890">+1 234 567 890</a>

// Line ~420: Location
<p>Your City, Your Country</p>
```

#### Update Social Media Links
```javascript
// Line ~440-480: Social media URLs
<a href="https://github.com/yourusername">     // GitHub
<a href="https://linkedin.com/in/yourprofile"> // LinkedIn
<a href="https://twitter.com/yourusername">    // Twitter
<a href="https://instagram.com/yourusername">  // Instagram
<a href="https://wa.me/1234567890">           // WhatsApp
```

---

### 2️⃣ About Section (10 minutes)

**File: `src/App.jsx`**

```javascript
// Line ~160: Update about text
<h3>Hi, I'm [Your Name]</h3>
<p>
  Write your introduction here...
</p>

// Line ~175: Update statistics
<h4>5+</h4>              // Years of experience
<p>Years Experience</p>

<h4>50+</h4>             // Number of projects
<p>Projects Completed</p>

<h4>10+</h4>             // Technologies you know
<p>Technologies</p>
```

---

### 3️⃣ Skills Section (15 minutes)

**File: `src/App.jsx`**

```javascript
// Line ~55: Update skills array
const skills = [
  { name: 'Your Skill 1', icon: <Code size={24} />, category: 'Category' },
  { name: 'Your Skill 2', icon: <Server size={24} />, category: 'Category' },
  { name: 'Your Skill 3', icon: <Database size={24} />, category: 'Category' },
  // Add more skills...
]

// Line ~280: Update additional technologies
{['Tech1', 'Tech2', 'Tech3', 'Tech4', 'Tech5'].map((tech, index) => (
  <span key={index} className="tech-tag">{tech}</span>
))}
```

**Available Icon Components:**
- `<Code />` - For programming languages
- `<Server />` - For backend technologies
- `<Database />` - For databases
- `<Layout />` - For frontend frameworks
- `<Palette />` - For design tools
- `<Briefcase />` - For general tools

---

### 4️⃣ Experience Section (20 minutes)

**File: `src/App.jsx`**

```javascript
// Line ~65: Update experiences array
const experiences = [
  {
    title: 'Your Job Title',
    company: 'Company Name',
    period: 'Start Year - End Year',
    description: 'Brief description of your role...',
    achievements: [
      'Achievement 1',
      'Achievement 2',
      'Achievement 3'
    ]
  },
  // Add more experiences...
]
```

---

### 5️⃣ Projects (Automated from API)

**Option A: Use Backend API**
Your projects will automatically load from the backend at `http://localhost:5000/api/projects`

**Option B: Update Mock Data**

**File: `src/App.jsx`**

```javascript
// Line ~125: Update mock projects in fetchProjects function
setProjects([
  {
    _id: '1',
    title: 'Your Project Title',
    description: 'Your project description...',
    tags: ['Tag1', 'Tag2', 'Tag3'],
    features: [
      { title: 'Feature1', description: 'Description' },
      { title: 'Feature2', description: 'Description' }
    ],
    liveUrl: 'https://yourproject.com',
    image: null  // or '/path/to/image.jpg'
  },
  // Add more projects...
])
```

---

### 6️⃣ Images (5 minutes)

1. **Profile Image**:
   - Replace `src/hehehe_upscale_upscaled (1).png` with your image
   - Update import in `App.jsx` (Line ~5)
   ```javascript
   import ProfilePhoto from './your-profile-image.png'
   ```

2. **Resume PDF**:
   - Add your resume to `public/` folder
   - Name it `Harshil_Barot_Resume.pdf` OR
   - Update all resume links:
   ```javascript
   // Search for: /Harshil_Barot_Resume.pdf
   // Replace with: /Your_Resume.pdf
   ```

---

### 7️⃣ Colors & Branding (10 minutes)

**File: `src/App.css`**

```css
/* Line ~15: Update color scheme */
:root {
  --primary: #4f46e5;        /* Main brand color */
  --primary-dark: #4338ca;   /* Darker variant */
  --primary-light: #6366f1;  /* Lighter variant */
  --secondary: #0ea5e9;      /* Secondary accent */
  
  /* Or try these popular color schemes: */
  
  /* Blue Theme */
  /* --primary: #3b82f6; */
  
  /* Purple Theme */
  /* --primary: #8b5cf6; */
  
  /* Green Theme */
  /* --primary: #10b981; */
  
  /* Orange Theme */
  /* --primary: #f97316; */
}
```

---

### 8️⃣ SEO & Meta Tags (5 minutes)

**File: `index.html`**

```html
<!-- Update meta tags -->
<meta name="description" content="Your custom description" />
<meta name="keywords" content="Your, Custom, Keywords" />
<meta name="author" content="Your Name" />

<!-- Update title -->
<title>Your Name - Your Title</title>

<!-- Update Open Graph tags -->
<meta property="og:title" content="Your Name - Your Title" />
<meta property="og:description" content="Your description" />
```

---

### 9️⃣ Footer (5 minutes)

**File: `src/App.jsx`**

```javascript
// Line ~520: Update footer content
<h3 className="footer-logo">YourName<span>.</span></h3>
<p>Your Professional Title</p>
<p className="footer-tagline">Your Tagline</p>

// Line ~560: Update copyright
<p>&copy; 2026 Your Name. All rights reserved.</p>
```

---

## 🎨 Advanced Customization

### Change Font

**File: `src/index.css`**

```css
/* Replace the Google Fonts import */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

/* Popular professional fonts: */
/* - Inter (current - modern, clean) */
/* - Poppins (friendly, rounded) */
/* - Montserrat (geometric, elegant) */
/* - Work Sans (neutral, readable) */
/* - DM Sans (contemporary) */
```

### Adjust Spacing

**File: `src/App.css`**

```css
/* Line ~350: Section padding */
section {
  padding: 8rem 0;  /* Change to 6rem or 10rem */
}

/* Line ~365: Section header margin */
.section-header {
  margin-bottom: 5rem;  /* Change to 4rem or 6rem */
}
```

### Animation Speed

**File: `src/App.css`**

```css
/* Line ~25: Global transition speed */
--transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
/* Change 0.3s to 0.2s (faster) or 0.5s (slower) */
```

---

## 📋 Common Tasks

### Add a New Section

1. Create section structure in `App.jsx`:
```javascript
<section className="new-section" id="new-section">
  <div className="container">
    <motion.div className="section-header">
      <span className="section-label">Label</span>
      <h2 className="section-title">Section Title</h2>
      <p className="section-subtitle">Subtitle text</p>
    </motion.div>
    
    {/* Your content here */}
  </div>
</section>
```

2. Add styles in `App.css`:
```css
.new-section {
  background: var(--dark-light);
  /* Add your styles */
}
```

3. Add to navigation in `App.jsx`:
```javascript
<a href="#new-section" className="nav-item">New Section</a>
```

### Change Card Hover Effect

**File: `src/App.css`**

```css
/* Line ~750: Project card hover */
.project-card-premium:hover {
  border-color: var(--primary);
  transform: translateY(-8px);  /* Change to -12px for more lift */
}
```

---

## 🚀 Deployment Checklist

Before deploying:

- [ ] Updated all personal information
- [ ] Replaced profile images
- [ ] Added resume PDF
- [ ] Updated social media links
- [ ] Tested all contact links
- [ ] Customized colors (optional)
- [ ] Updated meta tags for SEO
- [ ] Tested on mobile devices
- [ ] Built production version: `npm run build`

---

## 💡 Tips

1. **Keep Backups**: Before making changes, save a copy of the original files
2. **Test Locally**: Always test changes with `npm run dev` before deploying
3. **Mobile First**: Check how changes look on mobile devices
4. **Consistent Branding**: Use the same colors and fonts throughout
5. **Performance**: Optimize images before adding them (use WebP format)
6. **Accessibility**: Ensure text has good contrast with backgrounds

---

## 🆘 Need Help?

- Check the main [README.md](README.md) for setup instructions
- Review the code comments in `App.jsx` and `App.css`
- Test changes incrementally to identify issues quickly

---

**Remember**: This is YOUR portfolio. Don't be afraid to experiment and make it unique! 🎨
