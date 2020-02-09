# id3-tag-reader

mp3 tag reader for NodeJS

[![Build Status](https://travis-ci.org/UggoPrince/id3-tag-reader.svg?branch=develop)](https://travis-ci.org/UggoPrince/id3-tag-reader) [![Coverage Status](https://coveralls.io/repos/github/UggoPrince/id3-tag-reader/badge.svg?branch=develop)](https://coveralls.io/github/UggoPrince/id3-tag-reader?branch=develop)


### Installation

```
npm install id3-tag-reader
```

## Usage
```
const reader = require('id3-tag-reader');
const express = require('express');

const app = express();

app.post('/', reader(), async (req, res) => {
    res.status(200).send({
        data: req.id3Tag
    })
});


// req.id3Tag.CoverArt is a buffer of the cover art
```