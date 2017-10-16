const path = require('path');
const { baseUrl } = require('../../e2e/e2e-helpers');
const screenshotDirectory = path.join(__dirname, '../../../logs/visual-regression');

function getFileNames(route){
    const uri = route.replace(baseUrl, '');
    const baseline = path.join(screenshotDirectory, `/baseline${uri}.png`);
    const diff = path.join(screenshotDirectory, `/diffs${uri}.png`);

    return [baseline, diff];
}

module.exports = getFileNames;