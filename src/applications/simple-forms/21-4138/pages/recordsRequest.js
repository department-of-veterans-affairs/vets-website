import { titleUI } from '~/platform/forms-system/src/js/web-component-patterns';
import { RECORDS_REQUEST_HANDOFF } from '../config/constants';

/** @type {PageSchema} */
export const recordsRequestHandoffPage = {
  uiSchema: {
    ...titleUI(
      "There's a better way to request your personal records",
      undefined,
      1,
      'vads-u-color--black',
    ),
    'view:recordsRequestHandoffContent': {
      'ui:description': RECORDS_REQUEST_HANDOFF,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:recordsRequestHandoffContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
