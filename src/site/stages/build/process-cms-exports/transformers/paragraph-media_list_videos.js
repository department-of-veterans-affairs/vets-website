// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'media_list_videos',
  fieldSectionHeader: entity.fieldSectionHeader,
  fieldVideos: entity.fieldVideos,
});

module.exports = {
  filter: ['fieldSectionHeader', 'fieldVideos'],
  transform,
};
