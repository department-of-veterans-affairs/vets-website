import AvailableDebts from '../components/AvailableDebts';

export const uiSchema = {
  'ui:title': 'Available Debts',
  'ui:description': '',
  'ui:widget': AvailableDebts,
};

export const schema = {
  type: 'object',
  properties: {
    fsrDebts: {
      type: 'array',
    },
  },
};
