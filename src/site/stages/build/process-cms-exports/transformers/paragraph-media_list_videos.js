// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  contentModelType: entity.contentModelType,
  entityType: 'paragraph',
  entityBundle: 'media_list_videos',
});

module.exports = {
  filter: [''],
  transform,
};
