const multer = require('multer');

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
            cb(
                new Error(
                    `Unsupported file format: ${file.mimetype}. Supported formats: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm`
                )
            );
        }
    }
});

module.exports = upload;