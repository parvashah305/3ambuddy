const path = require('path');
const fs = require('fs');

// Base directories
const ROOT_DIR = path.resolve(__dirname, '..');
const SAMPLE_AUDIO_DIR = path.join(ROOT_DIR, 'sample_audio');
const RESULTS_DIR = path.join(ROOT_DIR, 'results');
const UPLOADS_DIR = path.join(ROOT_DIR, 'uploads');

// Voice settings
const VOICE_SETTINGS = {
    VOICE: "nova",
    MODEL: "gpt-4o-mini-tts"
};

// Function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
    try {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`Created directory: ${dirPath}`);
        }
    } catch (error) {
        console.error(`Error creating directory ${dirPath}:`, error);
        throw new Error(`Failed to create directory ${dirPath}: ${error.message}`);
    }
};

// Create required directories
try {
    ensureDirectoryExists(SAMPLE_AUDIO_DIR);
    ensureDirectoryExists(RESULTS_DIR);
    ensureDirectoryExists(UPLOADS_DIR);
} catch (error) {
    console.error('Failed to initialize required directories:', error);
    process.exit(1); // Exit if directories cannot be created
}

module.exports = {
    ROOT_DIR,
    SAMPLE_AUDIO_DIR,
    RESULTS_DIR,
    UPLOADS_DIR,
    VOICE_SETTINGS,
    ensureDirectoryExists // Export the function for use in other modules
};