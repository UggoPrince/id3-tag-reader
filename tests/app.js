const express = require('express');
const reader = require('../index');

const app = express();

app.post('/', reader(), async (req, res) => {
    res.status(200).send({
        data: req.id3Tag
    })
});

app.use((req, res) => {
    res.status(404).json('Not Found');
});

app.listen(3000, () => {
    console.log('server started.');
});

module.exports = app;
