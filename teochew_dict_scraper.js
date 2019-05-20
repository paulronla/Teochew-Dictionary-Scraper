'use strict';
const http = require('http');
const fs = require('fs');
const WRITE_PATH = '';
let page = 0;

http.get('http://www.czyzd.com/ajax/list?page='+page+'&keyword=&pinyin=&chaoyin=&bushou=&bihua=0', function (res) {
    const sb_text = [];

    res.setEncoding('utf8');
    res.on('data', chunk => sb_text.push(chunk));
    res.on('end', () => writeToFile(sb_text, WRITE_PATH, page));
});

function writeToFile (stringBuilder, writePath, fileName) {
    const file = WRITE_PATH + fileName + '.html';
    fs.writeFile(file, stringBuilder.join(''), (err) => {
        if (err) throw err; 
        console.log(file + ' saved.');
    });
}