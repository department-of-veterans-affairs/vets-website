const fs = require('fs');
const path = require('path');
const { baseUrl } = require('../../e2e/e2e-helpers');

const DIR_EXISTS_ALREADY = 'EEXIST';
const screenshotDirectory = path.join(__dirname, '../../../logs/visual-regression');
const baselineDir =  path.join(screenshotDirectory, '/baseline');
const diffDir =  path.join(screenshotDirectory, '/diffs');

function getFileNames(route){
    const uri = route.replace(baseUrl, '');
    const baseline = path.join(baselineDir, `/${uri}.png`);
    const diff = path.join(diffDir, `/${uri}.png`);

    return [baseline, diff];
}

function createDirectoryIfNotExist(filePath){
    const directory = path.dirname(filePath);

    // Try to create directory, and ignore the error if the directory couldn't be created because it already exists.
    return new Promise((resolve, reject) => fs.mkdir(directory, err => {
        if (!err || err.code == DIR_EXISTS_ALREADY){
            return resolve();
        }
        reject(err);
    }))
}

module.exports = {
    getFileNames,
    createDirectoryIfNotExist
};