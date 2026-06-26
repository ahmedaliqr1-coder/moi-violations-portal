const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname), {
  maxAge: '1d',
  etag: false
}));

// Main route - serve the violation enquiry page
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'eservices', 'gdt', 'violation-enquiry.html');
  console.log(`Serving: ${filePath}`);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error serving file:', err);
      res.status(500).send('Error loading page');
    }
  });
});

// Serve /main/* routes from the root directory
app.get('/main/*', (req, res) => {
  const requestedPath = req.path.replace('/main/', '');
  const filePath = path.join(__dirname, requestedPath);
  console.log(`Requested: ${req.path} -> ${filePath}`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`, err.message);
      res.status(404).send('File not found');
    }
  });
});

// Serve any other requested file
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  console.log(`Requested: ${req.path} -> ${filePath}`);
  
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, serve the main page
      console.log(`File not found: ${filePath}, serving main page`);
      res.sendFile(path.join(__dirname, 'eservices', 'gdt', 'violation-enquiry.html'), (mainErr) => {
        if (mainErr) {
          console.error('Error serving main page:', mainErr);
          res.status(404).send('Page not found');
        }
      });
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Internal server error');
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log(`🌐 Public URL: https://moi-violations-portal-production.up.railway.app`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
