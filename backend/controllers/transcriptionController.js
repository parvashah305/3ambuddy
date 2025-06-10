require('dotenv').config();
const fs = require('fs');
const path = require('path');
const stt_engine = require('../services/speech_to_text');

exports.transcribeAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  const originalPath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const audioPath = originalPath + fileExt;

  try {
    fs.renameSync(originalPath, audioPath);

    console.log(`Transcribing file: ${req.file.originalname} (${req.file.mimetype})`);

    const transcription = await stt_engine(audioPath);

    return res.json({ text: transcription.text });
  } catch (err) {
    console.error('Transcription Error:', err.message);

    try {
      if (fs.existsSync(originalPath)) fs.unlinkSync(originalPath);
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    } catch (cleanupErr) {
      console.error('Cleanup error:', cleanupErr.message);
    }

    return res.status(500).json({
      error: 'Failed to transcribe audio.',
      details: err.message
    });
  }
};