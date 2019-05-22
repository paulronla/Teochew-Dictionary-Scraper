'use strict';
const http = require('http');
const fs = require('fs');
const WRITE_PATH = '';
const START_PAGE = 57;
const END_PAGE = 62;
const WAIT_TIME = 10000;
const URL = `http://www.czyzd.com/ajax/list?page=0&keyword=&pinyin=&chaoyin=&bushou=&bihua=0`;

const getWebPage = genGetWebPage(URL);
getWebPageWithDelay(START_PAGE);

/*
genGetWebPage(URL)
URL is a string
returns a function

The returned function creates a closure around genGetWebPage which keeps alive frontURL and endURL,
so that it only needs to be processed once per script execution.
*/
function genGetWebPage(URL) {
    let [frontURL, endURL] = URL.split('page=0');
    frontURL += 'page=';

    return function (pageNum) {
        console.log('Downloading page ' +pageNum + '\n');

        http.get(frontURL + pageNum + endURL, function (res) {
            const sb_text = [];

            res.setEncoding('utf8');
            res.on('data', chunk => sb_text.push(chunk));
            res.on('end', () => writeToFile(sb_text.join(''), WRITE_PATH, pageNum));
        });
    }
}

/*
getWebPageWithDelay(pageNum)
pageNum is a number
returns void

Calls getWebPage(pageNum) every WAIT_TIME ms from START_PAGE to END_PAGE, inclusive.
*/
function getWebPageWithDelay(pageNum) {
    getWebPage(pageNum);

    if (pageNum < END_PAGE)
        setTimeout(() => getWebPageWithDelay(pageNum+1), WAIT_TIME);
}

function writeToFile (text, writePath, fileName) {
    const file = WRITE_PATH + fileName + '.html';

    fs.writeFile(file, text, () => {
        console.log(file + ' saved.\n');
    });
}
