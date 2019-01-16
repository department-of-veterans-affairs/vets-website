import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

const { hasTrainingPay } = fullSchema.properties;

export const uiSchema = {
  hasTrainingPay: {
    'ui:title':
      'Do you expect to receive active or inactive duty training pay?',
    'ui:widget': 'yesNo',
  },
};

export const schema = {
  type: 'object',
  required: ['hasTrainingPay'],
  properties: {
    hasTrainingPay,
  },
};
