import { generateTransition } from '../../../helpers';

export const schema = {
  type: 'object',
  properties: {
    'view:dependentsAdditionalInfo': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:dependentsAdditionalInfo': {
    'ui:description': generateTransition(
      'Now we’re going to ask you some follow-up questions about each of your dependents who have died. We’ll go through them one by one.',
    ),
    'ui:options': {
      hideOnReview: true,
    },
  },
};
