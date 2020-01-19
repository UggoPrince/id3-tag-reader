const multer = require('multer');
const AudioReader = require('./src/AudioReader');

// multer c0nfiguration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const reader = () => {
    return [
        upload.any(),
        async (req, res, next) => {
            const reader = new AudioReader();
            const tagData = await reader.readFile(req.files);
            req.id3Tag = tagData;
            next();
        }
    ];
};

module.exports = reader;
