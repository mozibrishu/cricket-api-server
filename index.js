// const express = require('express');
import express from 'express';
import cors from 'cors';
const app = express();
// const cors = require('cors');
const port = process.env.PORT || 3003;

import { fetchAndSave } from './methods/fetchingAndSaving.js';

var allowedOrigins = ['http://localhost:8080',
    'http://127.0.0.1:5500',
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            //return callback(new Error(msg), false);
            return callback((msg));
        }
        return callback(null, true);
    }
}));

// const home = require('./routes/home');
import home from './routes/home.js';
// const live = require('./routes/live');
// const score = require('./routes/score');
// const summary = require('./routes/summary');

app.use('/', home);
// app.use('/live', live);
// app.use('/score', score);
// app.use('/summary', summary);


app.use('/', function (req, res) {
    res.status(404).json({
        error: 1,
        message: 'Data not Found'
    });
})

app.listen(port, function () {
    console.log('listening on port ' + port);
});



// -------------
// const fs = require('fs');
import fs from 'fs';

const dataPath = './data/savedScore.json' // path to our JSON file

const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
}
const getAccountData = (dataPath) => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}
console.log(getAccountData('./data/urlFile.json').match_url);
fetchAndSave();
console.log('first',getAccountData(dataPath));
setInterval(() => {
    fetchAndSave();
    console.log('outside',getAccountData(dataPath));
}, 10000);