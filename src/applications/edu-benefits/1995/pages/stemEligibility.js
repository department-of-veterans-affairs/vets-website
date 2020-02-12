import { rogersStemEligibilityInfo } from '../content/stemEligibility';

export const uiSchema = {
  'view:rogersStemEligibilityInfo': {
    'ui:description': formData => rogersStemEligibilityInfo(formData),
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:rogersStemEligibilityInfo': {
      type: 'object',
      properties: {},
    },
  },
};
