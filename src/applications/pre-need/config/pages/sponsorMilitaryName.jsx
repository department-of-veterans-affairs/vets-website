import { merge } from 'lodash';

import environment from 'platform/utilities/environment';

import { militaryNameUI } from '../../utils/helpers';

export const uiSchema = merge({}, militaryNameUI, {
  application: {
    veteran: {
      'view:hasServiceName': {
        'ui:title': environment.isProduction()
          ? 'Did your sponsor serve under another name?'
          : 'Did the sponsor serve under another name?',
      },
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
          },
        },
      },
    },
  },
};
