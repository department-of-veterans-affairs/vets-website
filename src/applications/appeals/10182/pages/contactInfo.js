import ContactInfoDescription from '../components/ContactInformation';

const contactInfo = {
  uiSchema: {
    'ui:title': ' ',
    'ui:description': ContactInfoDescription,
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
