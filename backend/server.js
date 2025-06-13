const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

app.post('/api/scrape', (req, res) => {
  const { url } = req.body;
  
  // Set timeout to 60 seconds for complex pages
  res.setTimeout(60000, () => {
    res.status(504).json({ error: "Scraping timeout" });
  });

  // More robust path to the python executable and scraper script
  const pythonPath = path.resolve(__dirname, '..', '.venv', 'Scripts', 'python.exe');
  const scraperScript = path.resolve(__dirname, '..', 'scraper', 'scraper.py');

  const pythonProcess = spawn(pythonPath, [
    scraperScript,
    url
  ]);

  let data = '';
  pythonProcess.stdout.on('data', (chunk) => {
    data += chunk.toString();
  });

  let error = '';
  pythonProcess.stderr.on('data', (chunk) => {
    error += chunk.toString();
  });

  pythonProcess.on('close', (code) => {
    console.log('Python process exited with code:', code);
    
    if (code !== 0) {
      console.error('Python script failed:', error);
      return res.status(500).json({ error: error || 'Python script failed' });
    }

    try {
      const lines = data.trim().split('\n');
      const lastLine = lines[lines.length - 1];
      const result = JSON.parse(lastLine);
      
      if (result.error) {
        return res.status(500).json(result);
      }
      
      res.json(result);
    } catch (e) {
      console.error('JSON parse error:', e);
      console.error('Raw output from python:', data);
      res.status(500).json({ error: 'Invalid JSON from Python' });
    }
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});