const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entity: {
    entityType: 'taxonomy_term',
    entityBundle: 'audience_beneficiaries',
    name: getDrupalValue(entity.name),
  },
});

module.exports = {
  filter: ['name'],
  transform,
};
