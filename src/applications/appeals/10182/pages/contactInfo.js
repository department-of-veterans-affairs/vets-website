import ContactInfoDescription from '../components/ContactInformation';
import { contactInfoValidation } from '../validations';

const contactInfo = {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': ContactInfoDescription,
    'ui:required': () => true,
    'ui:validations': [contactInfoValidation],
    'ui:options': {
      hideOnReview: true,
      forceDivWrapper: true,
    },
  },

  schema: {
    type: 'object',
    properties: {},
  },
};

export default contactInfo;
