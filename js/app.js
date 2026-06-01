// AI Shorts Creator Application

class QuickClipAI {
  constructor() {
    this.user = null;
    this.videos = [];
    this.credits = 0;
    this.currentPage = 'home';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
    this.checkAuthStatus();
  }

  setupEventListeners() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav-link')) {
        this.navigateTo(e.target.dataset.page);
      }
      if (e.target.classList.contains('hamburger-toggle')) {
        const navLinks = document.querySelector('.nav-links');
        navLinks.classList.toggle('active');
      }
      if (e.target.classList.contains('logout-btn')) {
        this.logout();
      }
    });
  }

  checkAuthStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
      this.credits = localStorage.getItem('credits') || 0;
    }
  }

  navigateTo(page) {
    this.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('credits');
    this.user = null;
    this.currentPage = 'home';
    this.render();
  }

  render() {
    const root = document.getElementById('root');
    root.innerHTML = this.getPageHTML();
    this.attachPageListeners();
  }

  getPageHTML() {
    return `
      ${this.getNavbarHTML()}
      ${this.currentPage === 'home' ? this.getHomePageHTML() : ''}
      ${this.currentPage === 'dashboard' ? this.getDashboardHTML() : ''}
      ${this.getFooterHTML()}
    `;
  }

  getNavbarHTML() {
    return `
      <nav class="navbar">
        <div class="container">
          <div class="navbar-content">
            <div class="logo">
              <i class="fas fa-scissors"></i>
              QuickClipAI
            </div>
            <ul class="nav-links">
              <li><a href="#" class="nav-link" data-page="home">Home</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
            <div class="nav-buttons">
              ${this.user ? `
                <button class="btn btn-secondary" onclick="app.navigateTo('dashboard')">Dashboard</button>
                <button class="btn btn-primary logout-btn">Logout</button>
              ` : `
                <button class="btn btn-secondary" onclick="app.showAuthModal('login')">Sign In</button>
                <button class="btn btn-primary" onclick="app.showAuthModal('signup')">Get Started</button>
              `}
            </div>
            <div class="hamburger hamburger-toggle">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </nav>
    `;
  }

  getHomePageHTML() {
    return `
      ${this.getHeroHTML()}
      ${this.getFeaturesHTML()}
      ${this.getPricingHTML()}
      ${this.getHowItWorksHTML()}
      ${this.getFAQHTML()}
    `;
  }

  getHeroHTML() {
    return `
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            <div class="hero-grid">
              <div>
                <h1>Turn Any YouTube Video Into Viral Shorts</h1>
                <p>Let AI handle all the hard work. Upload a YouTube link, and we'll automatically edit it into viral short clips with titles, captions, and effects.</p>
                <div class="hero-buttons">
                  ${this.user ? `
                    <button class="btn btn-primary btn-large" onclick="app.navigateTo('dashboard')">Start Creating</button>
                  ` : `
                    <button class="btn btn-primary btn-large" onclick="app.showAuthModal('signup')">Try Free</button>
                  `}
                  <button class="btn btn-secondary btn-large" onclick="app.navigateTo('home')">
                    <i class="fas fa-play"></i> Watch Demo
                  </button>
                </div>
              </div>
              <div class="hero-video">
                <div class="hero-video-placeholder">
                  <i class="fas fa-play-circle"></i>
                </div>
                <div class="floating-box floating-box-1">
                  <h4>⚡ AI Powered</h4>
                  <p>Automated editing in minutes</p>
                </div>
                <div class="floating-box floating-box-2">
                  <h4>✓ High Quality</h4>
                  <p>Up to 4K resolution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getFeaturesHTML() {
    return `
      <section class="features-section" id="features">
        <div class="container">
          <div class="section-header">
            <h2>Powerful Features</h2>
            <p>Everything you need to create viral shorts with zero editing experience</p>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-magic"></i>
              </div>
              <h3>AI-Powered Editing</h3>
              <p>Our AI automatically edits your videos with perfect cuts, transitions, and effects</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-closed-captioning"></i>
              </div>
              <h3>Auto Captions</h3>
              <p>Generate captions automatically from audio using advanced speech recognition</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-palette"></i>
              </div>
              <h3>Smart Titles</h3>
              <p>AI creates engaging titles that grab attention and boost engagement</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-video"></i>
              </div>
              <h3>Multiple Formats</h3>
              <p>Export in TikTok, Instagram Reels, YouTube Shorts, and more formats</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-music"></i>
              </div>
              <h3>Built-in Music</h3>
              <p>Access to royalty-free music library to enhance your videos</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">
                <i class="fas fa-bolt"></i>
              </div>
              <h3>Lightning Fast</h3>
              <p>Get your edited videos in minutes, not hours</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getPricingHTML() {
    return `
      <section class="pricing-section" id="pricing">
        <div class="container">
          <div class="pricing-header">
            <h2>Simple, Transparent Pricing</h2>
            <p>Choose the plan that works for you. Upgrade or downgrade anytime.</p>
          </div>
          <div class="pricing-grid">
            ${this.getPricingCardHTML('basic', 'Basic', 5, 5, ['5 short clips', 'AI editing', 'Basic titles', 'Standard quality (720p)'], false)}
            ${this.getPricingCardHTML('pro', 'Pro', 10, 15, ['15 short clips', 'Advanced AI editing', 'Custom titles', 'HD quality (1080p)', 'Music library'], true)}
            ${this.getPricingCardHTML('premium', 'Premium', 15, 50, ['50 short clips', 'Premium AI editing', 'Custom branding', '4K quality', 'Music + SFX library', 'Priority processing'], false)}
          </div>
        </div>
      </section>
    `;
  }

  getPricingCardHTML(id, name, price, credits, features, featured) {
    return `
      <div class="pricing-card ${featured ? 'featured' : ''}">
        ${featured ? '<div class="badge">Most Popular</div>' : ''}
        <h3>${name}</h3>
        <div class="price">$${price}</div>
        <div class="price-period">one-time</div>
        <div class="credits">${credits} Video Credits</div>
        <ul class="features-list">
          ${features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('')}
        </ul>
        ${this.user ? `
          <button class="btn btn-primary" onclick="app.selectPlan('${id}', '${name}', ${price})">Get ${name}</button>
        ` : `
          <button class="btn btn-primary" onclick="app.showAuthModal('signup')">Get Started</button>
        `}
      </div>
    `;
  }

  getHowItWorksHTML() {
    return `
      <section class="how-it-works">
        <div class="container">
          <div class="section-header">
            <h2>How It Works</h2>
            <p>Three simple steps to create viral shorts</p>
          </div>
          <div class="steps-grid">
            <div class="step">
              <div class="step-number">1</div>
              <h4>Paste YouTube Link</h4>
              <p>Paste any YouTube video URL into our platform</p>
            </div>
            <div class="step">
              <div class="step-number">2</div>
              <h4>AI Edits</h4>
              <p>Our AI analyzes and creates multiple short clips with captions and effects</p>
            </div>
            <div class="step">
              <div class="step-number">3</div>
              <h4>Download & Share</h4>
              <p>Download your edited shorts and post to TikTok, Instagram, YouTube</p>
            </div>
            <div class="step">
              <div class="step-number">4</div>
              <h4>Go Viral</h4>
              <p>Watch your engagement skyrocket with AI-optimized content</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getFAQHTML() {
    return `
      <section style="padding: 120px 0; background: white;" id="faq">
        <div class="container">
          <div class="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about QuickClipAI</p>
          </div>
          <div style="max-width: 700px; margin: 0 auto;">
            ${this.getFAQItemHTML('Can I use YouTube videos from any channel?', 'Yes, you can use any YouTube video URL. We respect copyright and recommend using your own content or properly licensed videos.')}
            ${this.getFAQItemHTML('How long does it take to edit a video?', 'Most videos are processed within 5-10 minutes. Longer videos may take up to 30 minutes.')}
            ${this.getFAQItemHTML('What quality can I export?', 'You can export in standard (720p), HD (1080p), or 4K depending on your plan.')}
            ${this.getFAQItemHTML('Can I edit the videos after AI processing?', 'Yes, you can download the videos and edit them further using any video editor.')}
            ${this.getFAQItemHTML('Do you offer a free trial?', 'Yes, new users get 3 free credits to try the service.')}
          </div>
        </div>
      </section>
    `;
  }

  getFAQItemHTML(question, answer) {
    return `
      <div style="margin-bottom: 1.5rem; padding: 1.5rem; background: #f8fafc; border-radius: 12px; cursor: pointer;" onclick="this.classList.toggle('active')">
        <h4 style="color: var(--text); margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
          ${question}
          <i class="fas fa-chevron-down" style="font-size: 0.75rem;"></i>
        </h4>
        <p style="color: var(--text-secondary); display: none; margin: 0;">${answer}</p>
        <style>
          div.active p { display: block; }
        </style>
      </div>
    `;
  }

  getDashboardHTML() {
    return `
      <section class="dashboard show">
        <div class="container">
          <div class="dashboard-grid">
            <div class="dashboard-sidebar">
              <div class="user-info">
                <div class="user-avatar">
                  <i class="fas fa-user"></i>
                </div>
                <h3>${this.user?.name || 'User'}</h3>
                <div class="user-email">${this.user?.email || 'email@example.com'}</div>
              </div>
              <ul class="sidebar-menu">
                <li><button class="menu-btn active" data-section="processor"><i class="fas fa-play"></i> Create Shorts</button></li>
                <li><button class="menu-btn" data-section="videos"><i class="fas fa-film"></i> My Videos</button></li>
                <li><button class="menu-btn" data-section="credits"><i class="fas fa-coins"></i> Credits & Billing</button></li>
                <li><button class="menu-btn" data-section="settings"><i class="fas fa-cog"></i> Settings</button></li>
              </ul>
            </div>
            <div class="dashboard-content">
              ${this.getProcessorSectionHTML()}
              ${this.getVideosSectionHTML()}
              ${this.getCreditsSectionHTML()}
              ${this.getSettingsSectionHTML()}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  getProcessorSectionHTML() {
    return `
      <div class="content-section show" data-section="processor">
        <h2><i class="fas fa-play-circle"></i> Create Shorts</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem;">Paste a YouTube video URL and let our AI do all the editing work</p>
        
        <form class="processor-form" onsubmit="app.handleVideoSubmit(event)">
          <div class="form-group">
            <label for="youtube-url">YouTube Video URL</label>
            <input 
              type="url" 
              id="youtube-url" 
              placeholder="https://www.youtube.com/watch?v=..."
              required
            >
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="format">Video Format</label>
              <select id="format">
                <option value="vertical">Vertical (9:16) - TikTok/Reels</option>
                <option value="horizontal">Horizontal (16:9) - YouTube</option>
                <option value="square">Square (1:1) - Instagram</option>
              </select>
            </div>

            <div class="form-group">
              <label for="quality">Quality</label>
              <select id="quality">
                <option value="standard">Standard (720p)</option>
                <option value="hd">HD (1080p)</option>
                <option value="4k">4K (2160p)</option>
              </select>
            </div>
          </div>

          <div class="checkbox-group">
            <input type="checkbox" id="add-music" checked>
            <label for="add-music" style="margin: 0;">Add Background Music</label>
          </div>

          <button type="submit" class="btn btn-primary btn-large">Create Shorts</button>
        </form>

        <div class="processor-status" id="processor-status" style="display: none;">
          <div id="status-content"></div>
        </div>
      </div>
    `;
  }

  getVideosSectionHTML() {
    return `
      <div class="content-section" data-section="videos">
        <h2><i class="fas fa-film"></i> My Videos</h2>
        <div class="videos-list" id="videos-list">
          ${this.videos.length === 0 ? `
            <p style="text-align: center; color: var(--text-secondary); padding: 2rem;">
              You haven't created any videos yet. <a href="#" onclick="app.switchSection('processor'); return false;">Create your first short</a>
            </p>
          ` : this.videos.map(video => `
            <div class="video-item">
              <div class="video-info">
                <h4>${video.title}</h4>
                <p>Created on ${new Date(video.createdAt).toLocaleDateString()}</p>
              </div>
              <span class="video-status-badge ${video.status}">${video.status}</span>
              ${video.status === 'completed' ? `
                <a href="${video.url}" download class="btn btn-secondary btn-small">Download</a>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  getCreditsSectionHTML() {
    return `
      <div class="content-section" data-section="credits">
        <h2><i class="fas fa-coins"></i> Credits & Billing</h2>
        <div class="credits-info">
          <div class="credit-card">
            <h3>Available Credits</h3>
            <div class="credit-value">${this.credits}</div>
            <p>1 credit = 1 video</p>
          </div>
          <div class="credit-card">
            <h3>Recent Purchase</h3>
            <div class="credit-value">25</div>
            <p>Purchased on ${new Date().toLocaleDateString()}</p>
          </div>
        </div>
        <h3 style="margin-top: 2rem; margin-bottom: 1rem;">Get More Credits</h3>
        <div class="pricing-grid" style="max-width: none;">
          ${this.getPricingCardHTML('basic', 'Basic', 5, 5, ['5 short clips', 'AI editing', 'Basic titles'], false)}
          ${this.getPricingCardHTML('pro', 'Pro', 10, 15, ['15 short clips', 'Advanced AI editing', 'Custom titles'], true)}
          ${this.getPricingCardHTML('premium', 'Premium', 15, 50, ['50 short clips', 'Premium AI editing', '4K quality'], false)}
        </div>
      </div>
    `;
  }

  getSettingsSectionHTML() {
    return `
      <div class="content-section" data-section="settings">
        <h2><i class="fas fa-cog"></i> Settings</h2>
        <form style="max-width: 500px;">
          <div class="form-group">
            <label for="setting-name">Full Name</label>
            <input type="text" id="setting-name" value="${this.user?.name || ''}">
          </div>
          <div class="form-group">
            <label for="setting-email">Email</label>
            <input type="email" id="setting-email" value="${this.user?.email || ''}">
          </div>
          <button type="button" class="btn btn-primary" onclick="app.saveSettings()">Save Changes</button>
        </form>
      </div>
    `;
  }

  getFooterHTML() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-content">
            <div class="footer-section brand">
              <h3>QuickClipAI</h3>
              <p>Transform long-form videos into viral shorts with AI</p>
              <div class="social-links">
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
                <a href="#"><i class="fab fa-youtube"></i></a>
              </div>
            </div>
            <div class="footer-section">
              <h4>Product</h4>
              <ul>
                <li><a href="#">Features</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Company</h4>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Career</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Press</a></li>
              </ul>
            </div>
            <div class="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <p>&copy; 2024 QuickClipAI. All rights reserved.</p>
            <ul class="footer-links">
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
      </footer>
    `;
  }

  attachPageListeners() {
    // Menu buttons
    document.querySelectorAll('.menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchSection(e.target.closest('button').dataset.section);
      });
    });

    // Video download buttons (if any)
    document.querySelectorAll('[download]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Download functionality would be implemented with backend');
      });
    });
  }

  switchSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('show'));
    document.querySelectorAll('.menu-btn').forEach(btn => btn.classList.remove('active'));
    
    document.querySelector(`[data-section="${section}"]`).classList.add('show');
    document.querySelector(`[data-section="${section}"]`).closest('.dashboard-content').previousElementSibling
      .querySelector(`[data-section="${section}"]`).classList.add('active');
  }

  selectPlan(planId, planName, price) {
    if (!this.user) {
      this.showAuthModal('signup');
      return;
    }

    if (confirm(`Upgrade to ${planName} plan for $${price}?\n\nThis would open Stripe payment in a real application.`)) {
      alert(`Payment for ${planName} plan ($${price}) processed successfully!\n\nYou now have more credits to create shorts.`);
      this.navigateTo('dashboard');
    }
  }

  handleVideoSubmit(e) {
    e.preventDefault();
    
    const youtubeUrl = document.getElementById('youtube-url').value;
    const format = document.getElementById('format').value;
    const quality = document.getElementById('quality').value;
    const addMusic = document.getElementById('add-music').checked;

    if (!youtubeUrl) {
      alert('Please enter a YouTube URL');
      return;
    }

    if (this.credits <= 0) {
      alert('You need credits to create shorts. Please purchase a plan.');
      this.navigateTo('dashboard');
      this.switchSection('credits');
      return;
    }

    const statusDiv = document.getElementById('processor-status');
    const statusContent = document.getElementById('status-content');
    
    statusDiv.style.display = 'block';
    statusContent.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div class="processing-spinner"></div>
        <div>
          <h4 style="color: var(--warning); margin: 0; margin-bottom: 0.5rem;">Processing Your Video</h4>
          <p style="margin: 0; color: var(--text-secondary);">This may take a few minutes...</p>
        </div>
      </div>
      <div style="margin-top: 1rem; padding: 1rem; background: white; border-radius: 8px;">
        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Downloading video...</div>
          <div style="height: 6px; background: #e0e0e0; border-radius: 3px;"><div style="height: 100%; width: 25%; background: var(--primary); border-radius: 3px; transition: width 0.3s;"></div></div>
        </div>
        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Analyzing content...</div>
          <div style="height: 6px; background: #e0e0e0; border-radius: 3px;"><div style="height: 100%; width: 50%; background: var(--primary); border-radius: 3px;"></div></div>
        </div>
        <div style="margin-bottom: 0.75rem;">
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">Adding captions & effects...</div>
          <div style="height: 6px; background: #e0e0e0; border-radius: 3px;"><div style="height: 100%; width: 75%; background: var(--primary); border-radius: 3px;"></div></div>
        </div>
      </div>
    `;

    // Simulate processing
    setTimeout(() => {
      this.credits--;
      localStorage.setItem('credits', this.credits);
      
      statusContent.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: rgba(16, 185, 129, 0.1); color: var(--success); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
            <i class="fas fa-check"></i>
          </div>
          <div>
            <h4 style="color: var(--success); margin: 0; margin-bottom: 0.5rem;">Video Ready!</h4>
            <p style="margin: 0; color: var(--text-secondary);">Your short clips have been created and are ready to download.</p>
          </div>
        </div>
        <div style="margin-top: 1.5rem;">
          <div class="video-preview">
            <div style="width: 100%; height: 100%; background: #000; display: flex; align-items: center; justify-content: center; color: white;">
              <i class="fas fa-video" style="font-size: 2rem;"></i>
            </div>
          </div>
          <div class="video-actions" style="margin-top: 1rem;">
            <button class="btn btn-primary" onclick="alert('Download would be implemented with backend')">Download Video</button>
            <button class="btn btn-secondary" onclick="app.handleVideoSubmit.reset = true; document.getElementById('youtube-url').value = ''; document.getElementById('processor-status').style.display = 'none';">Create Another</button>
          </div>
        </div>
      `;

      // Add to videos list
      const newVideo = {
        title: 'Edited Short from YouTube',
        createdAt: new Date(),
        status: 'completed',
        url: '#'
      };
      this.videos.unshift(newVideo);
    }, 3000);
  }

  showAuthModal(type) {
    const authHtml = type === 'login' ? `
      <div style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; align-items: center; justify-content: center;" class="auth-modal" onclick="this.style.display='none'" id="auth-modal">
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%;" onclick="event.stopPropagation()">
          <h2 style="color: var(--text); margin-bottom: 1.5rem;">Sign In</h2>
          <div class="form-group">
            <label for="login-email">Email</label>
            <input type="email" id="login-email" placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input type="password" id="login-password" placeholder="••••••••">
          </div>
          <button class="btn btn-primary btn-large" style="width: 100%;" onclick="app.handleLogin()">Sign In</button>
          <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
            Don't have an account? <a href="#" style="color: var(--primary);" onclick="app.showAuthModal('signup'); event.preventDefault();">Sign Up</a>
          </p>
        </div>
      </div>
    ` : `
      <div style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 2000; align-items: center; justify-content: center;" class="auth-modal" onclick="this.style.display='none'" id="auth-modal">
        <div style="background: white; padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%;" onclick="event.stopPropagation()">
          <h2 style="color: var(--text); margin-bottom: 1.5rem;">Create Account</h2>
          <div class="form-group">
            <label for="signup-name">Full Name</label>
            <input type="text" id="signup-name" placeholder="John Doe">
          </div>
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input type="email" id="signup-email" placeholder="your@email.com">
          </div>
          <div class="form-group">
            <label for="signup-password">Password</label>
            <input type="password" id="signup-password" placeholder="••••••••">
          </div>
          <button class="btn btn-primary btn-large" style="width: 100%;" onclick="app.handleSignup()">Create Account</button>
          <p style="text-align: center; margin-top: 1rem; color: var(--text-secondary);">
            Already have an account? <a href="#" style="color: var(--primary);" onclick="app.showAuthModal('login'); event.preventDefault();">Sign In</a>
          </p>
        </div>
      </div>
    `;

    const modal = document.createElement('div');
    modal.innerHTML = authHtml;
    document.body.appendChild(modal);
    document.getElementById('auth-modal').style.display = 'flex';
  }

  handleLogin() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    this.user = { name: 'User', email };
    this.credits = 3; // Free trial credits
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('credits', this.credits);
    localStorage.setItem('token', 'mock-token');
    
    document.getElementById('auth-modal').style.display = 'none';
    this.render();
  }

  handleSignup() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    this.user = { name, email };
    this.credits = 3; // Free trial credits
    localStorage.setItem('user', JSON.stringify(this.user));
    localStorage.setItem('credits', this.credits);
    localStorage.setItem('token', 'mock-token');
    
    document.getElementById('auth-modal').style.display = 'none';
    alert('Account created! You have 3 free credits to start.');
    this.navigateTo('dashboard');
  }

  saveSettings() {
    const name = document.getElementById('setting-name').value;
    const email = document.getElementById('setting-email').value;
    
    if (!name || !email) {
      alert('Please fill in all fields');
      return;
    }

    this.user = { name, email };
    localStorage.setItem('user', JSON.stringify(this.user));
    alert('Settings saved successfully!');
  }
}

// Initialize app
const app = new QuickClipAI();