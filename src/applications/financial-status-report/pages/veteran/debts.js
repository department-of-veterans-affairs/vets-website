import AvailableDebts from '../../components/AvailableDebts';

export const uiSchema = {
  'ui:title': 'Available Debts',
  'ui:description': '',
  'ui:field': AvailableDebts,
  fsrDebts: {
    'ui:title': ' ',
  },
};

export const schema = {
  type: 'object',
  properties: {
    fsrDebts: {
      type: 'array',
      title: ' ',
      minItems: 0,
      items: {
        type: 'object',
        properties: {},
      },
    },
  },
};
