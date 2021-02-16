const utilityOptions = [
  'Yes, I pay utility bills.',
  "No, I don't pay utility bills.",
];

export const uiSchema = {
  'ui:title': 'Your monthly utility bills',
  hasUtilities: {
    'ui:title':
      'Do you pay any utility bills, such as electricity, water, or gas?',
    'ui:required': () => true,
    'ui:widget': 'radio',
    'ui:options': {
      classNames: 'no-wrap',
    },
  },
};
export const schema = {
  type: 'object',
  properties: {
    hasUtilities: {
      type: 'string',
      enum: utilityOptions,
    },
  },
};
