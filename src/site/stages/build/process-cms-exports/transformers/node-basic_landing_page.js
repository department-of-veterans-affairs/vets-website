// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'basic_landing_page',
  fieldIntroTextLimitedHtml: {},
});

module.exports = {
  filter: [''],
  transform,
};
