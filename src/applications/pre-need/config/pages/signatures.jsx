import MultipleSingatures from '../../components/MultipleSignatures';

export const uiSchema = {
  'ui:title': 'Signatures',
  application: {
    'ui:field': MultipleSingatures,
  },
};
export const schema = {
  type: 'object',
  properties: {
    application: {
      type: 'object',
      properties: {},
    },
  },
};
