import ContactInfoCard from '../../components/ContactInfoCard';

export const uiSchema = {
  'ui:title': 'Contact information',
  'ui:description':
    'This is the contact information we have on file for you. Please verify that this information is correct.',
  contactInfo: {
    'ui:field': ContactInfoCard,
  },
};

export const schema = {
  type: 'object',
  properties: {
    contactInfo: {
      type: 'object',
      properties: {
        fullName: {
          type: 'string',
        },
        ssnLastFour: {
          type: 'number',
        },
        dob: {
          type: 'string',
        },
        vaFileNumber: {
          type: 'number',
        },
      },
    },
  },
};
