import StemEligibilityView from '../containers/StemEligibilityView';

const determineEligibilityIsNotChecked = formData =>
  formData['view:determineEligibility']['view:determineEligibility'] ===
  undefined;

export const uiSchema = {
  'ui:title': 'Rogers STEM Scholarship eligibility',
  'view:determineEligibility': {
    'view:determineEligibility': {
      'ui:required': determineEligibilityIsNotChecked,
    },
    'ui:field': StemEligibilityView,
  },
};

export const schema = {
  type: 'object',
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
