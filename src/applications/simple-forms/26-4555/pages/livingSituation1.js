const livingSituation1 = {
  uiSchema: {
    isLivingInCareFacility: {
      'ui:title':
        'Are you currently living in a nursing home or medical care facility?',
      'ui:widget': 'yesNo',
    },
  },
  schema: {
    type: 'object',
    required: ['isLivingInCareFacility'],
    properties: {
      isLivingInCareFacility: {
        type: 'boolean',
      },
    },
  },
};

export default livingSituation1;
