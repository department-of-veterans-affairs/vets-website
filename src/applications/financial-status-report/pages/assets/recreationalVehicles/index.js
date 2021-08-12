export const uiSchema = {
  'ui:title': 'Your trailers, campers, and boats',
  questions: {
    hasRecreationalVehicle: {
      'ui:title': 'Do you own any trailers, campers, or boats?',
      'ui:widget': 'yesNo',
      'ui:required': () => true,
      'ui:errorMessages': {
        required: 'Please enter your trailer, camper, or boat information.',
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
        hasRecreationalVehicle: {
          type: 'boolean',
        },
      },
    },
  },
};
