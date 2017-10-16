const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const { baseUrl } = require('../../e2e/e2e-helpers');

const DIR_EXISTS_ALREADY = 'EEXIST';
const screenshotDirectory = path.join(__dirname, '../../../logs/visual-regression');
const baselineDir = path.join(screenshotDirectory, '/baseline');
const diffDir = path.join(screenshotDirectory, '/diffs');

function getFileNames(route) {
    const uri = route.replace(baseUrl, '');
    const baseline = path.join(baselineDir, `/${uri}.png`);
    const diff = path.join(diffDir, `/${uri}.png`);

    return [ baseline, diff ];
}

function createDirectoryIfNotExist(filePath) {
    const directory = path.dirname(filePath);

    return new Promise((resolve, reject) => mkdirp(directory, err => err ? reject(err) : resolve()));
}

module.exports = {
    getFileNames,
    createDirectoryIfNotExist
};