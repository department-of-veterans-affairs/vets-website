import RealEstateOwnershipValue from '../../../components/RealEstateOwnershipValue';

export const uiSchema = {
  'ui:title': '',
  questions: {
    hasRealEstate: {
      'ui:title': ' ',
      'ui:widget': RealEstateOwnershipValue,
      'ui:errorMessages': {
        required: 'Please enter your property value.',
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
