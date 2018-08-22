export const uiSchema = {
  'view:hasSeparationPay': {
    'ui:title': 'Did you receive separation pay or severance pay?',
    'ui:widget': 'yesNo'
  },
  'view:hasTrainingPay': {
    'ui:title': 'Did you receive active or inactive training pay?',
    'ui:widget': 'yesNo'
  }
};

export const schema = {
  type: 'object',
  required: ['view:hasSeparationPay', 'view:hasTrainingPay'],
  properties: {
    'view:hasSeparationPay': {
      type: 'boolean'
    },
    'view:hasTrainingPay': {
      type: 'boolean'
    }
  }
};
