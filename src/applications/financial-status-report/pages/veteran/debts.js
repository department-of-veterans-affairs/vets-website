import AvailableDebts from '../../components/AvailableDebts';

export const uiSchema = {
  'ui:field': AvailableDebts,
  selectedDebts: {
    items: {
      fileNumber: {
        'ui:title': 'File number',
      },
      benefitType: {
        'ui:title': 'Benefit type',
      },
      diaryCodeDescription: {
        'ui:title': 'Description',
      },
    },
  },
};

export const schema = {
  type: 'object',
  properties: {
    selectedDebts: {
      type: 'array',
      minItems: 0,
      items: {
        type: 'object',
        title: 'Debt',
        properties: {
          fileNumber: {
            type: 'string',
          },
          benefitType: {
            type: 'string',
          },
          diaryCodeDescription: {
            type: 'string',
          },
        },
      },
    },
  },
};
