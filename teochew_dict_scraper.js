'use strict';
const args = process.argv.slice(2).map(val => val.toLowerCase());
const http = require('http');
const fs = require('fs').promises;
//TODO: better file name validation
//directory to write to
const WRITE_PATH = optionVal(args, '--dir=') ? 
optionVal(args, '--dir=').endsWith('/') ? optionVal(args, '--dir=') : optionVal(args, '--dir=') + '/'
: optionVal(args, '--dir=');
const START_PAGE = optionVal(args, '--start=') * 1 || 0;
const END_PAGE = optionVal(args, '--end=') * 1 || START_PAGE+1; //downloads up to, but not including this page
const WAIT_TIME = optionVal(args, '--wait=') * 1 || 10000; //ms
const URL = 'http://www.czyzd.com/ajax/list?page=0&keyword=&pinyin=&chaoyin=&bushou=&bihua=0';
const VERSION = '1.0';

if (~args.indexOf('--help') || ~args.indexOf('-h')) {
    console.log(
        `
        Usage: 
        node teochew_dict_scraper.js --flag=value
        
        Options: 
        --dir            <output directory>
        --start          <start page number>
        --end            <up to but not including this end page number>
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

page == 2 is always a duplicate of page == 1 on their servers, so skip page == 2
*/
(async function () {
    let [frontURL, endURL] = URL.split('page=0');
    frontURL += 'page=';
    const rejectAsyncWaitToken = {};

    await createWritePath(WRITE_PATH);
    
    getWebPageAndWrite(START_PAGE, frontURL, endURL).catch(err => {
        console.log('The error at page '+START_PAGE+': '+err.message+'\n');

        if (END_PAGE - START_PAGE === 1)
            return;

        if (err.message === 'Exceeded end of dictionary')
            rejectAsyncWaitToken.reject();
    });

    for (let i = START_PAGE+1; i < END_PAGE; i++) {
        if (i === 2)
            continue;

        await asyncWait(WAIT_TIME, rejectAsyncWaitToken);
        
        getWebPageAndWrite(i, frontURL, endURL).catch(err => {
            console.log('The error at page '+i+': '+err.message+'\n');

            if (err.message === 'Exceeded end of dictionary')
                rejectAsyncWaitToken.reject();
        });
    }
})().catch(err => console.log(err.message+'\n'));

/*
getWebPageAndWrite(pageNum, frontURL, endURL)
pageNum: number
frontURL: string
endURL: string
returns: void

Gets the web page and then writes it to the file system.
-1 returned from getWebPage means no results were returned from that query.
*/
async function getWebPageAndWrite (pageNum, frontURL, endURL) {
    const text = await getWebPage(pageNum, frontURL, endURL);
    if (text === '-1')
        return new Promise ( (resolve, reject) => reject(new Error('Exceeded end of dictionary')));

    let fileName = WRITE_PATH + pageNum + '.html';
    await fs.writeFile(fileName, text);
    console.log(fileName + ' saved.\n')
}

function getWebPage (pageNum, frontURL, endURL) {
    console.log('Downloading page ' +pageNum + '\n');

    return new Promise ( (resolve, reject) => {
        http.get(frontURL + pageNum + endURL, function (res) {
            const sb_text = [];

            res.setEncoding('utf8');
            res.on('data', chunk => sb_text.push(chunk));
            res.on('end', () => resolve(sb_text.join('')));
            res.on('error', err => reject(err));
        }).on('error', err => reject(err));
    });
}

//takes a token that allows other code to reject this promise if the wait isn't necessary
function asyncWait (time, token) {
    return new Promise ((resolve, reject) => {
        let t = setTimeout(resolve, time);

        token.reject = function() {
            clearTimeout(t);
            reject(new Error('Timer cleared.'));
        }
    });
}

//checks the path and if it doesn't exist, creates it.
async function createWritePath(path) {
    if (!path)
        return;
    
    await fs.access(path).catch(async () => {
        await fs.mkdir(path,{recursive: true});
        console.log(path + ' created.\n');
    });
}

//gets the value associated with that flag
function optionVal(arr, flag) {
    let idx = arr.findIndex(elem => elem.includes(flag));

    if (~idx)
        return arr[idx].split('=')[1];

    return '';
}
