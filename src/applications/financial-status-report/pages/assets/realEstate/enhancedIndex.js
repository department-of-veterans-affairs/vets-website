import RealEstateOwnershipQuestion from '../../../components/RealEstateOwnershipQuestion';

export const uiSchema = {
  'ui:title': 'Your real estate assets',
  questions: {
    hasRealEstate: {
      'ui:title': ' ',
      'ui:widget': RealEstateOwnershipQuestion,
      'ui:errorMessages': {
        required: 'Please enter your real estate information.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      properties: {
        hasRealEstate: {
          type: 'boolean',
        },
      },
    },
  },
};
