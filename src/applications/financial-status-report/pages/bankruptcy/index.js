export const uiSchema = {};
export const schema = {
  type: 'object',
  properties: {
    questions: {
      type: 'object',
      required: ['hasBeenAdjudicatedBankrupt'],
      properties: {
        hasBeenAdjudicatedBankrupt: {
          type: 'boolean',
        },
      },
    },
  },
};
