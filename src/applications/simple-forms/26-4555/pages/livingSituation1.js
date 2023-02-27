const livingSituation1 = {
  uiSchema: {
    isInCareFacility: {
      'ui:title':
        'Are you currently living in a nursing home or medical care facility?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isInCareFacility'],
    properties: {
      isInCareFacility: {
        type: 'boolean',
      },
    },
  },
};

export default livingSituation1;
