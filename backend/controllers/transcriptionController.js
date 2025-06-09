require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.transcribeAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  const originalPath = req.file.path;
  const fileExt = path.extname(req.file.originalname).toLowerCase();
  const audioPath = originalPath + fileExt;
  const language = req.body.language || '';

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
};