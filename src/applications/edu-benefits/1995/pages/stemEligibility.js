import StemEligibilityView from '../components/StemEligibilityView';
import _ from 'lodash';

const determineEligibilityIsNotChecked = formData =>
  _.get(formData, 'determineEligibility') === undefined;

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
        determineEligibility: {
          type: 'boolean',
        },
      },
    },
  },
};
