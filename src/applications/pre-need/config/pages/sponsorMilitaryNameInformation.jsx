import { merge } from 'lodash';
import get from 'platform/utilities/data/get';

import fullSchemaPreNeed from 'vets-json-schema/dist/40-10007-schema.json';

import fullNameUI from 'platform/forms/definitions/fullName';

const { fullName } = fullSchemaPreNeed.definitions;

export const uiSchema = {
  application: {
    veteran: {
      'ui:title': 'Sponsor’s previous name',
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
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {
        veteran: {
          type: 'object',
          properties: {
            serviceName: fullName,
          },
        },
      },
    },
  },
};
