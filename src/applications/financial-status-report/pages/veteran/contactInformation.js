import ContactInfoDescription from '../../components/contact-information/ContactInformation';
import { contactInfoValidation } from '../../utils/validations';

export const uiSchema = {
  'ui:title': ' ',
  'ui:description': ContactInfoDescription,
  'ui:required': () => true,
  'ui:validations': [contactInfoValidation],
  'ui:options': {
    hideOnReview: true,
    forceDivWrapper: true,
  },
};

export const schema = {
  type: 'object',
  properties: {},
};
