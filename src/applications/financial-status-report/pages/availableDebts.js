import AvailableDebts from '../components/AvailableDebts';

export const uiSchema = {
  'view:availableDebts': {
    'ui:field': AvailableDebts,
  },
};

export const schema = {
  type: 'object',
  properties: {
    'view:availableDebts': {
      type: 'object',
      properties: {},
    },
  },
};
