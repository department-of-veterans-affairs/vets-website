import StemEligibilityView from '../containers/StemEligibilityView';

const determineEligibilityIsNotChecked = formData =>
  formData.determineEligibility === undefined;

export const uiSchema = {
  'ui:title': 'Rogers STEM Scholarship eligibility',
  'view:determineEligibility': {
    determineEligibility: {
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
