import { SUBMIT_PAGE_CONTENT } from '../config/constants';

export const submitPage = {
  uiSchema: {
    'view:submitPageContent': {
      'ui:description': SUBMIT_PAGE_CONTENT,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:submitPageContent': {
        type: 'object',
        properties: {},
      },
    },
  },
};
