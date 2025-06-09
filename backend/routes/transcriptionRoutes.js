const express = require('express');
const router = express.Router();
const { transcribeAudio } = require('../controllers/transcriptionController');
const upload = require('../middleware/multerConfig');

router.post('/transcribe', upload.single('file'), transcribeAudio);

module.exports = router;