// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'media_list_videos',
  fieldIntroTextLimitedHtml: {},
});

module.exports = {
  filter: [''],
  transform,
};
