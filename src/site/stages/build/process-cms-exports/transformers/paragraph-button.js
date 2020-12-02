// Remove eslint-disable when transformer is complete
/* eslint-disable no-unused-vars */
const { getDrupalValue } = require('./helpers');

const transform = entity => {
  return {
    entity: {
      entityType: 'paragraph',
      entityBundle: 'button',
      fieldButtonLabel: getDrupalValue(entity.fieldButtonLabel),
      fieldButtonLink: {
        url: {
          path: entity.fieldButtonLink[0]?.uri,
        },
      },
    },
  };
};

module.exports = {
  filter: ['field_button_label', 'field_button_link'],
  transform,
};
