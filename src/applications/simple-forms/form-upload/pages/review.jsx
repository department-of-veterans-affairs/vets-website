import { USER_INFO_REVIEW } from '../config/constants';

export const reviewPage = {
  uiSchema: {
    'view:userInfoReview': {
      'ui:description': USER_INFO_REVIEW,
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:userInfoReview': {
        type: 'object',
        properties: {},
      },
    },
  },
};
