import TransitionPageDescription from './transitionPageDescription';

export const schema = {
  type: 'object',
  properties: {
    'view:additionalEvidenceDescription': {
      type: 'object',
      properties: {},
    },
  },
};

export const uiSchema = {
  'view:additionalEvidenceDescription': {
    'ui:description': TransitionPageDescription,
  },
};
