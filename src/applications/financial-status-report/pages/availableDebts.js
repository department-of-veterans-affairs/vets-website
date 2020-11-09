import AvailableDebts from '../components/AvailableDebts';

export const uiSchema = {
  'ui:title': 'Available Debts',
  'ui:description': '',
  fsrDebts: {
    'ui:title': ' ',
    'ui:options': {
      viewField: AvailableDebts,
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    fsrDebts: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};
