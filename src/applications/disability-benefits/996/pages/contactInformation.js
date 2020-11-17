import ContactInfoDescription from '../components/ContactInformation';

const contactInfo = {
  uiSchema: {
    'ui:title': 'Contact Information',
    'ui:description': ContactInfoDescription,
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
