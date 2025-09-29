export const uiSchema = {
  'view:removeDependentPickList': {
    'ui:title': 'Which dependents would you like to remove?',
    'ui:required': () => true,
    'ui:errorMessages': {
      required: 'Select at least one option',
    },
    'ui:options': {
      tile: true,
      labelHeaderLevel: '3',
      enableAnalytics: true,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {},
};
