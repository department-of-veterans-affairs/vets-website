import { generateTransition } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    'view:additionalQuestionsMessage': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:additionalQuestionsMessage': {
    'ui:description': generateTransition(
      'Now we’ll ask you about each of your spouse’s former marriages.',
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
};
