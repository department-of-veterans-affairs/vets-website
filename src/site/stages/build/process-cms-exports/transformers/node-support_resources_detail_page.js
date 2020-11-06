// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'support_resources_detail_page',
  fieldIntroTextLimitedHtml: {},
});

module.exports = {
  filter: [''],
  transform,
};
