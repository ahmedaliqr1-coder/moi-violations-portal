const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'eservices', 'gdt', 'violation-enquiry.html'));
});

// Serve any other HTML files
app.get('/:folder/:subfolder/:file', (req, res) => {
  const filePath = path.join(__dirname, req.params.folder, req.params.subfolder, req.params.file);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

// Fallback 404
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'eservices', 'gdt', 'violation-enquiry.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
