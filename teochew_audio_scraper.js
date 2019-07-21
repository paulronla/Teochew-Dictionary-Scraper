'use strict';
const args = process.argv.slice(2).map(val => val.toLowerCase());
const http = require('http');
const fs = require('fs');
const tds = require('./teochew_dict_scraper.js');
const chaoyinAudioMap = require('./chaoyin_audio.json');
//TODO: better file name validation
//directory to write to
const WRITE_PATH = tds.optionVal(args, '--dir=') ? 
tds.optionVal(args, '--dir=').endsWith('/') ? tds.optionVal(args, '--dir=') : tds.optionVal(args, '--dir=') + '/'
: tds.optionVal(args, '--dir=');
const START_TRACK = tds.optionVal(args, '--start_track=') * 1 || 0;
const END_TRACK = tds.optionVal(args, '--end_track=') * 1 || START_TRACK+1; //downloads up to, but not including this page
const WAIT_TIME = tds.optionVal(args, '--wait=') * 1 || 10000; //ms
const URL = 'cd ';
const VERSION = '1.0';

if (~args.indexOf('--help') || ~args.indexOf('-h')) {
    console.log(
        `
        Usage: 
        node teochew_audio_scraper.js --flag=value
        
        Options: 
        --dir            <output directory>
        --start_track    <start audio number>
        --end_track      <up to but not including this end audio number>
        --wait           <wait time in ms>
        --help || -h     <brings up this help>
        --version || -v  <version>
        `
        );
    return;
}

if (~args.indexOf('--version') || ~args.indexOf('-v')) {
    console.log(VERSION);
    return;
}

/*
IIFE that waits WAIT_TIME ms in between web page downloads. 

Most of the time is spent awaiting asyncWait, so if I go past
the end of the dictionary, just clear the timer and reject the 
promise immediately.
*/
(async function () {
    await tds.createWritePath(WRITE_PATH);

    const chaoyinArr = Object.getOwnPropertyNames(chaoyinAudioMap);
    
    getAudio(START_TRACK, URL, 
            chaoyinAudioMap[chaoyinArr[START_TRACK]], 
            chaoyinArr[START_TRACK]).catch(err => {
        console.log('The error at track '+START_TRACK+': '+err.message+'\n');

        if (END_TRACK - START_TRACK === 1)
            return;
    });

    for (var i = START_TRACK+1; i < END_TRACK; i++) {
        if (i >= chaoyinArr.length) {
            console.log('Exceeded end of json');
            return;
        }

        await tds.asyncWait(WAIT_TIME);
        
        let chaoyin = chaoyinArr[i];

        getAudio(i, URL, chaoyinAudioMap[chaoyin], chaoyin).catch(err => {
            console.log('The error at track '+--i+': '+err.message+'\n');
        });
    }
})().catch(err => console.log(err.message+'\n'));

function getAudio (trackNum, frontURL, trackName, chaoyin) {
    console.log('Downloading track ' + trackNum + '\n');

    return new Promise ( (resolve, reject) => {
        const fileName = WRITE_PATH + chaoyin + '.mp3';
        const options = {
            headers: {
                'user-agent': '*'
            }
        }; //needed or will get status code 500

        http.get(frontURL + trackName + '.mp3', options, function (res) {
            if (res.statusCode !== 200) {
                reject(new Error('Status code for ' + chaoyin + ': ' + res.statusCode));
            }

            const wStream = fs.createWriteStream(fileName, 'binary');

            res.pipe(wStream);
            res.on('end', () => {
                console.log(fileName + ' saved.\n'); 
                resolve();
            });
            res.on('error', err => reject(err));
        }).on('error', err => reject(err));
    });
}