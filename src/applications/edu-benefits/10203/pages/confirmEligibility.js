import StemEligibilityView from '../containers/StemEligibilityView';

export const uiSchema = {
  'ui:title': 'Rogers STEM Scholarship eligibility',
  'view:determineEligibility': {
    'ui:field': StemEligibilityView,
  },
};

export const schema = {
  type: 'object',
  required: ['view:determineEligibility'],
  properties: {
    'view:determineEligibility': {
      type: 'object',
      properties: {
        'view:determineEligibility': {
          type: 'boolean',
        },
      },
    },
  },
};
