import {
  textUI,
  textSchema,
} from 'platform/forms-system/src/js/web-component-patterns';

import {
  finishAppLaterLink,
  applicantRelationToVetOrgHeaders,
} from '../utils/helpers';

/** @type {PageSchema} */
export default {
  uiSchema: {
    'ui:description': applicantRelationToVetOrgHeaders,
    yourOrgText: textUI({
      title:
        'Enter the name of the Veterans Service Organization (VSO) you represent',
    }),
    'view:finishAppLaterLink': {
      'ui:description': finishAppLaterLink,
    },
  },

  schema: {
    type: 'object',
    properties: {
      yourOrgText: textSchema,
      'view:finishAppLaterLink': {
        type: 'object',
        properties: {},
      },
    },
    required: ['yourOrgText'],
  },
};
