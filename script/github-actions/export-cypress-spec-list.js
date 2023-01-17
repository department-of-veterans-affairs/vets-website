const { countCySpecs } = require('../count-cy-specs');

const files = countCySpecs();
/* eslint-disable no-console */

console.log(files);
