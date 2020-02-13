import StemEligibilityView from '../components/StemEligibilityView';

export const uiSchema = {
  'view:determineEligibility': {
    'ui:title': 'Rogers STEM Scholarship eligibility',
    'ui:field': StemEligibilityView,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:determineEligibility': {
      type: 'object',
      required: ['determineEligibility'],
      properties: {
        determineEligibility: {
          type: 'boolean',
        },
      },
    },
  },
};
