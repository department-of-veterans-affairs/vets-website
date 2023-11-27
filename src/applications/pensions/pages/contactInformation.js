import fullSchemaPensions from 'vets-json-schema/dist/21P-527EZ-schema.json';

import phoneUI from 'platform/forms-system/src/js/definitions/phone';

const {
  email,
  altEmail,
  dayPhone,
  nightPhone,
  mobilePhone,
} = fullSchemaPensions.properties;

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:title': 'Contact information',
    email: {
      'ui:title': 'Primary email',
    },
    altEmail: {
      'ui:title': 'Secondary email',
    },
    dayPhone: phoneUI('Daytime phone'),
    nightPhone: phoneUI('Evening phone'),
    mobilePhone: phoneUI('Mobile phone'),
  },
  schema: {
    type: 'object',
    required: ['veteranAddress'],
    properties: {
      email,
      altEmail,
      dayPhone,
      nightPhone,
      mobilePhone,
    },
  },
};
