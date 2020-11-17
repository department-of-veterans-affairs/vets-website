const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'node',
  entityBundle: 'q_a',
  title: getDrupalValue(entity.title),
  fieldTags: entity.fieldTags[0],
});

module.exports = {
  filter: ['title', 'field_tags'],
  transform,
};
