// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'media_list_images',
  fieldSectionHeader: entity.fieldSectionHeader,
  fieldImages: entity.fieldImages,
});

module.exports = {
  filter: ['fieldSectionHeader', 'fieldImages'],
  transform,
};
