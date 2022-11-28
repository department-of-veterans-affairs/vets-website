import ContactInfoDescription from '../../components/ContactInformation';
// import { contactInfoValidation } from '../validations';

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': ContactInfoDescription,
  'ui:required': () => true,
  // 'ui:validations': [contactInfoValidation],
  'ui:options': {
    hideOnReview: true,
    forceDivWrapper: true,
  },
};

export const schema = {
  type: 'object',
  properties: {},
};
