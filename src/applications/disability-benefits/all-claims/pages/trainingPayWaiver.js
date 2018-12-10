import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { waiveTrainingPayDescription } from '../content/trainingPayWaiver';

const { waiveTrainingPay } = fullSchema.properties;

export const uiSchema = {
  'ui:title': 'Training pay waiver',
  waiveTrainingPay: {
    'ui:title': ' ',
    'ui:description': waiveTrainingPayDescription,
    'ui:widget': 'yesNo',
    'ui:options': {
      yesNoReverse: true,
      labels: {
        Y:
          'I don’t want to get VA compensation pay for the days I receive training pay.',
        N: 'I want to get VA compensation pay instead of training pay.',
      },
    },
  },
};

export const schema = {
  type: 'object',
  required: ['waiveTrainingPay'],
  properties: {
    waiveTrainingPay,
  },
};
