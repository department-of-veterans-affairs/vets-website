// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => ({
  entityType: 'paragraph',
  entityBundle: 'email_contact',
  fieldEmailAddress: entity.fieldEmailAddress,
  fieldEmailLabel: entity.fieldEmailLabel,
});

module.exports = {
  filter: ['fieldEmailAddress', 'fieldEmailLabel'],
  transform,
};
