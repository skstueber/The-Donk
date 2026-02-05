// server.js - Node.js Backend Server
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Admin credentials from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

// Email configuration
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_FROM = process.env.EMAIL_FROM || EMAIL_USER;
const SITE_URL = process.env.SITE_URL || 'http://localhost:3000';

// Simple session store (in production, use Redis or database)
const sessions = new Map();

// Subscribers file path
const subscribersPath = path.join(__dirname, 'subscribers.json');

// Initialize subscribers file if it doesn't exist
if (!fs.existsSync(subscribersPath)) {
  fs.writeFileSync(subscribersPath, JSON.stringify([]));
}

// Configure nodemailer
let transporter = null;
if (EMAIL_USER && EMAIL_PASSWORD) {
  transporter = nodemailer.createTransport({
    service: 'gmail', // or 'smtp.gmail.com'
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD
    }
  });
  
  // Verify email configuration on startup
  transporter.verify(function(error, success) {
    if (error) {
      console.error('❌ Email configuration error:', error.message);
      console.log('📧 Emails will NOT be sent. Please check your EMAIL_USER and EMAIL_PASSWORD in .env');
      transporter = null; // Disable if verification fails
    } else {
      console.log('✅ Email server is ready to send messages');
      console.log(`📧 Sending from: ${EMAIL_FROM}`);
    }
  });
} else {
  console.log('⚠️  Email not configured (EMAIL_USER and/or EMAIL_PASSWORD missing)');
  console.log('   Newsletter emails will be skipped');
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Verify session token
function verifyToken(token) {
  return sessions.has(token);
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = generateToken();
    sessions.set(token, { username, loginTime: Date.now() });
    
    res.json({ 
      success: true, 
      token,
      message: 'Login successful'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid credentials' 
    });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  const { token } = req.body;
  sessions.delete(token);
  res.json({ success: true });
});

// Middleware to protect routes
function requireAuth(req, res, next) {
  const token = req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token || !verifyToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  next();
}

// Helper function to get subscribers
function getSubscribers() {
  try {
    const data = fs.readFileSync(subscribersPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to save subscribers
function saveSubscribers(subscribers) {
  fs.writeFileSync(subscribersPath, JSON.stringify(subscribers, null, 2));
}

// Helper function to send email
async function sendNewArticleEmail(article) {
  if (!transporter) {
    console.log('⚠️  Email not configured. Skipping email notification.');
    console.log('   To enable emails, add EMAIL_USER and EMAIL_PASSWORD to your .env file');
    return;
  }

  const subscribers = getSubscribers();
  
  if (subscribers.length === 0) {
    console.log('📭 No subscribers to notify.');
    return;
  }

  console.log(`📧 Sending email to ${subscribers.length} subscriber(s)...`);

  const preview = article.content ? article.content.split(/\s+/).slice(0, 85).join(' ') + '...' : article.description;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Georgia, serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background: #f5f5f5;
        }
        .container {
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #5dade2;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-family: 'Times New Roman', serif;
          font-size: 48px;
          color: #5dade2;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }
        .tagline {
          color: #666;
          font-size: 14px;
          font-style: italic;
        }
        h1 {
          color: #333;
          font-size: 28px;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        .meta {
          color: #666;
          font-size: 13px;
          margin-bottom: 20px;
          font-family: Arial, sans-serif;
        }
        .meta strong {
          color: #5dade2;
        }
        .description {
          font-size: 18px;
          color: #5dade2;
          margin-bottom: 20px;
          font-weight: 500;
        }
        .preview {
          color: #666;
          line-height: 1.8;
          margin-bottom: 30px;
        }
        .cta {
          text-align: center;
          margin: 30px 0;
        }
        .button {
          display: inline-block;
          padding: 15px 40px;
          background: #5dade2;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .footer {
          border-top: 1px solid #ddd;
          padding-top: 20px;
          margin-top: 40px;
          text-align: center;
          color: #999;
          font-size: 12px;
          font-family: Arial, sans-serif;
        }
        .unsubscribe {
          color: #999;
          text-decoration: none;
        }
        img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">The Donk</div>
          <p class="tagline">Political Analysis & Commentary</p>
        </div>
        
        <h1>${article.title}</h1>
        
        <div class="meta">
          <strong>By ${article.author}</strong> • ${article.date}
        </div>
        
        <div class="description">${article.description}</div>
        
        ${article.image ? `<img src="${SITE_URL}/${article.image}" alt="${article.title}">` : ''}
        
        <div class="preview">${preview}</div>
        
        <div class="cta">
          <a href="${SITE_URL}/index.html" class="button">Read Full Article</a>
        </div>
        
        <div class="footer">
          <p>You're receiving this because you subscribed to The Donk newsletter.</p>
          <p><a href="${SITE_URL}/unsubscribe.html?email={{email}}" class="unsubscribe">Unsubscribe</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  // Send to all subscribers
  let successCount = 0;
  let failCount = 0;
  
  for (const subscriber of subscribers) {
    try {
      const personalizedHtml = htmlContent.replace('{{email}}', encodeURIComponent(subscriber.email));
      
      await transporter.sendMail({
        from: `"The Donk" <${EMAIL_FROM}>`,
        to: subscriber.email,
        subject: `New Article: ${article.title}`,
        html: personalizedHtml
      });
      
      console.log(`  ✓ Email sent to: ${subscriber.email}`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Failed to send email to ${subscriber.email}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`📬 Email Summary: ${successCount} sent, ${failCount} failed out of ${subscribers.length} total`);
}

// Subscribe endpoint
app.post('/api/subscribe', (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid email is required' 
      });
    }
    
    const subscribers = getSubscribers();
    
    // Check if already subscribed
    if (subscribers.some(sub => sub.email === email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'This email is already subscribed' 
      });
    }
    
    // Add new subscriber
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString()
    });
    
    saveSubscribers(subscribers);
    
    res.json({ 
      success: true, 
      message: 'Successfully subscribed!' 
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe' 
    });
  }
});

// Unsubscribe endpoint
app.post('/api/unsubscribe', (req, res) => {
  try {
    const { email } = req.body;
    
    const subscribers = getSubscribers();
    const filtered = subscribers.filter(sub => sub.email !== email);
    
    if (filtered.length === subscribers.length) {
      return res.status(404).json({ 
        success: false, 
        message: 'Email not found' 
      });
    }
    
    saveSubscribers(filtered);
    
    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed' 
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe' 
    });
  }
});

// Test email endpoint (protected - only for admin testing)
app.post('/api/test-email', requireAuth, async (req, res) => {
  try {
    if (!transporter) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email not configured. Add EMAIL_USER and EMAIL_PASSWORD to .env' 
      });
    }

    const subscribers = getSubscribers();
    if (subscribers.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No subscribers. Subscribe at /subscribe.html first' 
      });
    }

    const testArticle = {
      title: "Test Article - Email System Check",
      description: "This is a test to verify your email system is working correctly",
      author: "System Test",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      image: "img/test.jpg",
      content: "This is a test email to verify that your newsletter system is properly configured and working. If you're seeing this, congratulations! Your email integration is set up correctly. ".repeat(20)
    };

    await sendNewArticleEmail(testArticle);

    res.json({ 
      success: true, 
      message: `Test email sent to ${subscribers.length} subscriber(s). Check your inbox!` 
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: `Failed to send test email: ${error.message}` 
    });
  }
});

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const imgDir = path.join(__dirname, 'img');
    if (!fs.existsSync(imgDir)) {
      fs.mkdirSync(imgDir);
    }
    cb(null, imgDir);
  },
  filename: function (req, file, cb) {
    // Generate filename from article title
    const ext = path.extname(file.originalname);
    const filename = req.body.articleId + ext;
    cb(null, filename);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  }
});

// Add new article endpoint (protected)
app.post('/api/add-article', requireAuth, upload.single('image'), (req, res) => {
  try {
    const { articleId, title, description, author, date, content, featured } = req.body;
    
    // Get uploaded image filename
    const imagePath = req.file ? `img/${req.file.filename}` : '';
    
    // Create article object
    const newArticle = {
      id: articleId,
      title: title,
      description: description,
      author: author,
      date: date,
      image: imagePath,
      content: content,
      featured: featured === 'true'
    };
    
    // Read existing articles.js file
    const articlesPath = path.join(__dirname, 'js', 'articles.js');
    let articlesContent = fs.readFileSync(articlesPath, 'utf8');
    
    // Find the articlesData array
    const arrayMatch = articlesContent.match(/const articlesData = \[([\s\S]*?)\];/);
    
    if (!arrayMatch) {
      return res.status(500).json({ error: 'Could not parse articles.js' });
    }
    
    // Parse existing articles
    const existingArticlesText = arrayMatch[1].trim();
    let articlesArray = [];
    
    if (existingArticlesText) {
      // Wrap in array brackets and parse
      try {
        articlesArray = JSON.parse('[' + existingArticlesText + ']');
      } catch (e) {
        console.error('Parse error:', e);
        return res.status(500).json({ error: 'Error parsing existing articles' });
      }
    }
    
    // Add new article to the beginning (most recent first)
    articlesArray.unshift(newArticle);
    
    // Generate new articles.js content
    const newArticlesContent = `// articles.js - Article Data Structure
const articlesData = [
${articlesArray.map(article => '  ' + JSON.stringify(article, null, 2).split('\n').join('\n  ')).join(',\n')}
];

// Helper functions
function getFeaturedArticle() {
  return articlesData.find(article => article.featured);
}

function getRegularArticles() {
  return articlesData.filter(article => !article.featured);
}

function getArticleById(id) {
  return articlesData.find(article => article.id === id);
}

// Export for use in your HTML
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { articlesData, getFeaturedArticle, getRegularArticles, getArticleById };
}
`;
    
    // Write updated articles.js
    fs.writeFileSync(articlesPath, newArticlesContent, 'utf8');
    
    // Send email notification to subscribers
    await sendNewArticleEmail(newArticle);
    
    res.json({ 
      success: true, 
      message: 'Article added successfully!',
      article: newArticle
    });
    
  } catch (error) {
    console.error('Error adding article:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all articles endpoint
app.get('/api/articles', (req, res) => {
  try {
    const articlesPath = path.join(__dirname, 'js', 'articles.js');
    const articlesContent = fs.readFileSync(articlesPath, 'utf8');
    
    // Extract articlesData array
    const arrayMatch = articlesContent.match(/const articlesData = \[([\s\S]*?)\];/);
    if (arrayMatch) {
      const articlesArray = JSON.parse('[' + arrayMatch[1].trim() + ']');
      res.json(articlesArray);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error('Error reading articles:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Add articles at http://localhost:${PORT}/add-article.html`);
});
