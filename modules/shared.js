'use strict';
const fs = require('fs').promises;

//takes a token that allows other code to reject this promise if the wait isn't necessary
function asyncWait (time, token = {}) {
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

module.exports = {'asyncWait': asyncWait, 
                'createWritePath': createWritePath, 
                'optionVal': optionVal};