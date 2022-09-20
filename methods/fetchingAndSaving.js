// const express = require('express');
import express from 'express';
const router = express.Router();
// const randomUseragent = require('random-useragent');
import randomUseragent from 'random-useragent';
const rua = randomUseragent.getRandom();

// const cheerio = require('cheerio');
import cheerio from 'cheerio';
// import * as cheerio from 'cheerio';
// import { load } from 'cheerio';


// const axios = require('axios');
import axios from 'axios';
// const bodyParser = require("body-parser")
import bodyParser from 'body-parser';
// const fs = require('fs');
import fs from 'fs';
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }));

// https://www.sportsadda.com/cricket/scores-fixtures/scorecard/tanzania-vs-malawi-live-scores-t20-match-tzmwi09202022216732
// const dataPath = './utlis/realTimeScore.json' // path to our JSON file
const dataPath = './data/savedScore.json' // path to our JSON file

// util functions
const saveAccountData = (data) => {
    const stringifyData = JSON.stringify(data)
    fs.writeFileSync(dataPath, stringifyData, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
}
const getLocalData = (dataPath) => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}
const getAccountData = (dataPath) => {
    const jsonData = fs.readFileSync(dataPath)
    return JSON.parse(jsonData)
}

const match_url = getLocalData('./data/urlFile.json').match_url;

let str = match_url || '';
// let live_url = str.replace('www', 'm');
let live_url = str;

export function fetchAndSave() {
    axios({
        method: 'GET',
        url: live_url,
        headers: {
            'User-Agent': rua
        }
    }).then(function (response) {

        var $ = cheerio.load(response.data);

        var team1_name = $("div.team.team-a > div.team-info > span").text();
        var team1_score = $("div.team.team-a > div.team-score > div > span.score").text();
        var team1_overAndrr = $("div.team.team-a > div.team-score > div > span.si-overs").text();
        var team1_over = team1_overAndrr.substr(0, team1_overAndrr.indexOf(")") + 1);

        // var team1_name = $("div.score-primary-partition > div.score-strip.team1-score-strip > div.flag-country > span.country.bind > a").text();
        // var team1_score = $("div.score-strip.team1-score-strip > div.score-over > span.score.bind").text();
        // var team1_overAndrr = $("div.team.team-a > div.team-score > div > span.si-overs").text();
        // var team1_over = team1_overAndrr.substr(0, team1_overAndrr.indexOf(")") + 1);


        var team2_name = $("div.team.team-b > div.team-info > span").text();
        var team2_score = $(" div.team.team-b > div.team-score.won > div > span.score").text();

        var team2_overAndrr = $("div.team.team-b > div.team-score.won > div > span.si-overs").text();
        var team2_over = team2_overAndrr.substr(0, team2_overAndrr.indexOf(")") + 1);


        // if (team2_score) {
        //     var temp2 = team2_name;
        //     team2_name = team1_name;
        //     team1_name = temp2;
        //     var temp = team2_score;
        //     team2_score = team1_score;
        //     team1_score = temp;

        //     var temp3 = team2_over;
        //     team2_over = team1_over;
        //     team1_over = temp3;
        // } else {
        //     team2_score = '-';
        //     team2_over = '-';
        // }


        // var title = $("h4.ui-header").text();

        var livescore = ({
            team1_name: team1_name || "Data Not Found",
            team1_score: team1_score || "Data Not Found",
            team1_over: team1_over || "Data Not Found",
            team2_name: team2_name || "Data Not Found",
            team2_score: team2_score || "Data Not Found",
            team2_over: team2_over || "Data Not Found",
            // title: title || "Data Not Found",

        });
        if (team1_name !== 'Data Not Found') {
            saveAccountData(livescore);
        }
        // res.send(JSON.stringify(livescore, null, 4));
        console.log('inside',getAccountData(dataPath));

    }).catch(function (error) {
        console.log('Error: ', error.message);
        console.log('catch');

        // setTimeout(async () => {
        // fetchAndSave();
        //     await console.log(getAccountData(dataPath));
        // }, 10000);
        // fetchAndSave();
        // if (!error.response) {
        //     res.json(errormsg());
        // } else {
        //     res.json(errormsg());
        // }
    });
}