export const uiSchema = {
  'ui:title': 'Your cars or other vehicles',
  hasVehicle: {
    'ui:title': 'Do you own any cars or other vehicles?',
    'ui:widget': 'yesNo',
    'ui:required': () => true,
  },
};

export const schema = {
  type: 'object',
  properties: {
    hasVehicle: {
      type: 'boolean',
    },
  },
};
