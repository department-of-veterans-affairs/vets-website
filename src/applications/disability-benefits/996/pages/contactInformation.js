import { contactInfoDescription } from '../content/contactInformation';

const contactInfo = {
  uiSchema: {
    'ui:title': 'Contact Information',
    'ui:description': contactInfoDescription,
    'ui:options': {
      hideOnReview: true,
    },
  },

  schema: {
    type: 'object',
    properties: {},
  },
};

export default contactInfo;
