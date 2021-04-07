import _ from 'lodash';

import { validateWhiteSpace } from 'platform/forms/validations';
import fullNameUI from 'platform/forms/definitions/fullName';
import FullNameField from 'platform/forms-system/src/js/fields/FullNameField';

import fullSchema from '../0873-schema.json';

const { organizationalRole } = fullSchema.properties;

const formFields = {
  names: 'names',
  account: 'account',
};

const allegationPage = {
  uiSchema: {
    [formFields.names]: {
      'ui:title': `Who was involved?`,
      'ui:options': {
        itemName: 'involved individual',
        viewField: FullNameField,
      },
      items: _.merge({}, fullNameUI, {
        first: {
          'ui:title': `First name`,
        },
        middle: {
          'ui:title': `Middle name`,
        },
        last: {
          'ui:title': `Last name`,
        },
        organizationalRole: {
          'ui:title': `Organizational role`,
          'ui:widget': 'radio',
        },
      }),
    },
    [formFields.account]: {
      'ui:title': `In as few or as many words as you need, please tell us what happened.`,
      'ui:widget': 'textarea',
      'ui:validations': [validateWhiteSpace],
    },
  },
  schema: {
    type: 'object',
    properties: {
      [formFields.names]: {
        type: 'array',
        minItems: 0,
        items: {
          type: 'object',
          properties: {
            first: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
            },
            middle: {
              type: 'string',
            },
            last: {
              type: 'string',
              minLength: 1,
              maxLength: 30,
            },
            suffix: {
              type: 'string',
              enum: ['Jr.', 'Sr.', 'II', 'III', 'IV'],
            },
            organizationalRole,
          },
        },
      },
      [formFields.account]: {
        type: 'string',
      },
    },
  },
};

export default allegationPage;
