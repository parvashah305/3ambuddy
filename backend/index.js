const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 5000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'audio/mpeg',     
      'audio/wav',      
      'audio/x-wav',    
      'audio/webm',     
      'audio/ogg',      
      'audio/mp4',      
      'audio/x-m4a',    
      'audio/flac'     
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file format: ${file.mimetype}. Supported formats: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm`));
    }
  }
});

app.use(express.json());

app.post('/transcribe', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  const originalPath = req.file.path;
  const language = req.body.language || '';
  
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  

  const audioPath = originalPath + fileExt;
  
  try {
    
    fs.renameSync(originalPath, audioPath);
    
    console.log(`Transcribing file: ${req.file.originalname} (${req.file.mimetype})`);
    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioPath),
      model: 'whisper-1',
      ...(language && { language })
    });

    fs.unlinkSync(audioPath);
    
    res.json({ text: transcription.text });
    
  } catch (err) {
    console.error('Transcription Error:', err.message);
    
    try {
      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr.message);
    }
    
    res.status(500).json({ 
      error: 'Failed to transcribe audio.',
      details: err.message 
    });
  }
});


app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});