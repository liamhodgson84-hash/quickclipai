# QuickClipAI - AI-Powered YouTube Shorts Creator

## 🚀 Features

### AI-Powered Video Editing
- Automatically extract viral clips from long-form videos
- AI-generated titles and captions
- Smart transitions and effects
- Multiple format support (TikTok, Instagram, YouTube Shorts)

### Pricing Plans
- **Basic ($5)**: 5 video credits + standard quality
- **Pro ($10)**: 15 video credits + HD quality + music library
- **Premium ($15)**: 50 video credits + 4K quality + priority processing

### Simple 3-Step Process
1. Paste YouTube URL
2. Let AI edit the video
3. Download and share on social media

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- YouTube video URL
- Payment method (for purchasing credits)

## 🛠 Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No installation or server setup required for the frontend

## 💳 Payment Integration

The website integrates with Stripe for secure payment processing:

### To enable live payments:

1. Get your Stripe API keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add your public key to the environment variables
3. Set up backend webhook handlers

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🎨 Design Features

- Modern gradient UI with glassmorphism effects
- Fully responsive design
- Smooth animations and transitions
- Accessibility-first approach
- Dark mode compatible

## 📝 File Structure

```
index.html              # Main HTML file
styles/
├── global.css          # Global styles and CSS variables
├── navbar.css          # Navigation bar styles
├── hero.css            # Hero section styles
├── pricing.css         # Pricing section styles
├── features.css        # Features section styles
├── dashboard.css       # Dashboard styles
└── footer.css          # Footer styles
js/
└── app.js              # Main application logic
```

## 🔧 Backend Integration

To use the full functionality, you'll need:

1. **Video Processing Service**
   - Download YouTube videos
   - Extract clips using AI
   - Add captions and effects
   - Export to multiple formats

2. **Authentication**
   - User registration and login
   - Token management
   - Profile management

3. **Payment Processing**
   - Stripe integration
   - Credit system
   - Transaction history

4. **Cloud Storage**
   - Store processed videos
   - Generate download links
   - Manage user files

## 🚀 Deployment

### Deploy to GitHub Pages

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

Then enable GitHub Pages in repository settings.

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

Drag and drop the folder on [netlify.com](https://netlify.com)

## 🔐 Security Notes

- Never expose API keys in frontend code
- Use environment variables for sensitive data
- Implement CORS properly on backend
- Validate all user inputs
- Use HTTPS for all connections

## 📊 Analytics

The app includes placeholders for:
- User signup tracking
- Video processing metrics
- Payment conversion tracking
- Feature usage analytics

## 🤝 Support

For issues or questions:
- Check FAQ section on website
- Contact support email
- Visit documentation

## 📄 License

BSD 2-Clause "Simplified" License

## ✨ Credits

Built with:
- HTML5
- CSS3
- JavaScript (Vanilla)
- Font Awesome Icons
- Stripe API (for payments)

---

**QuickClipAI** - Turn any YouTube video into viral shorts with AI ⚡