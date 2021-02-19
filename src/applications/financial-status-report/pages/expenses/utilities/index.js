export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  hasUtilities: {
    'ui:title':
      'Do you pay any monthly utility bills (like water, electricity, or gas)?',
    'ui:required': () => true,
    'ui:widget': 'yesNo',
    'ui:options': {
      classNames: 'no-wrap',
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasUtilities: {
      type: 'boolean',
    },
  },
};
