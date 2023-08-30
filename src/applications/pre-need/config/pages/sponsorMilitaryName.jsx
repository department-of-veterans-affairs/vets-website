import { merge } from 'lodash';
import get from 'platform/utilities/data/get';
import omit from 'platform/utilities/data/omit';

import fullNameUI from 'platform/forms/definitions/fullName';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';
import { militaryNameUI } from '../../utils/helpers';

const fullName = fullSchemaPreNeed.definitions;

const nonRequiredFullName = omit('required', fullName);

export const uiSchema = merge({}, militaryNameUI, {
  application: {
    veteran: {
      'view:hasServiceName': {
        'ui:title': 'Did your sponsor serve under another name?',
      },
      serviceName: merge({}, fullNameUI, {
        first: {
          'ui:title': 'Sponsor’s first name',
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        last: {
          'ui:title': 'Sponsor’s last name',
          'ui:required': form =>
            get('application.veteran.view:hasServiceName', form) === true,
        },
        middle: {
          'ui:title': 'Sponsor’s middle name',
        },
        suffix: {
          'ui:title': 'Sponsor’s suffix',
        },
      }),
    },
  },
});
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          required: ['view:hasServiceName'],
          properties: {
            'view:hasServiceName': {
              type: 'boolean',
            },
            serviceName: nonRequiredFullName,
          },
        },
      },
    },
  },
};
