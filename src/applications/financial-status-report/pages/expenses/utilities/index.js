export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  hasUtilities: {
    'ui:title':
      'Do you pay any utility bills, such as electricity, water, or gas?',
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
