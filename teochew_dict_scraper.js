'use strict';
const http = require('http');
const fs = require('fs');
const WRITE_PATH = '';
const START_PAGE = 67;
const END_PAGE = 74;
const WAIT_TIME = 10000;
const URL = `http://www.czyzd.com/ajax/list?page=0&keyword=&pinyin=&chaoyin=&bushou=&bihua=0`;

/*
IIFE that waits WAIT_TIME ms in between web page downloads. 
The final page doesn't require the wait.
*/
(async function () {
    let [frontURL, endURL] = URL.split('page=0');
    frontURL += 'page=';

    for (let i = START_PAGE, promises = [,], oneBeforeEnd = END_PAGE-1; i < oneBeforeEnd; i++) {
        promises[0] = asyncWait(WAIT_TIME);
        promises[1] = getWebPageAndWrite(i, frontURL, endURL);
        await Promise.all(promises);
    }

    getWebPageAndWrite(END_PAGE-1, frontURL, endURL);
})();

/*
getWebPageAndWrite(pageNum, frontURL, endURL)
pageNum: number
frontURL: string
endURL: string
returns: void

Gets the web page and then writes it to the file system.
*/
async function getWebPageAndWrite (pageNum, frontURL, endURL) {
    try{
        const text = await getWebPage(pageNum, frontURL, endURL);
        await writeToFile(text, WRITE_PATH, pageNum);
    } catch (e) {
        console.log(e+'\n');
    }
}

function getWebPage (pageNum, frontURL, endURL) {
    console.log('Downloading page ' +pageNum + '\n');

    return new Promise ( (resolve, reject) => {
        http.get(frontURL + pageNum + endURL, function (res) {
            const sb_text = [];

            res.setEncoding('utf8');
            res.on('data', chunk => sb_text.push(chunk));
            res.on('end', () => resolve(sb_text.join('')));
            res.on('error', e => reject(e.message));
        }).on('error', err => reject(err.message));
    });
}

function writeToFile (text, writePath, fileName) {
    const file = WRITE_PATH + fileName + '.html';

    return new Promise ( (resolve, reject) => {
        fs.writeFile(file, text, err => {
            if (err) 
                reject(err.message);
            else{
                console.log(file + ' saved.\n');
                resolve();
            }
        });
    });
}

function asyncWait (time) {
    return new Promise (resolve => setTimeout(resolve, time));
}
