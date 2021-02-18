export const uiSchema = {
  'ui:title': 'Your trailers, campers, and boats',
  hasRecreationalVehicle: {
    'ui:title': 'Do you own any trailers, campers, or boats?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasRecreationalVehicle: {
      type: 'boolean',
    },
  },
};
