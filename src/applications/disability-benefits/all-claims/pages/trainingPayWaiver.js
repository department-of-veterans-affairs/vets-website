import fullSchema from '../config/schema';
import { waiveTrainingPayDescription } from '../content/trainingPayWaiver';

const { waiveTrainingPay } = fullSchema.properties;

export const uiSchema = {
  waiveTrainingPay: {
    'ui:title': 'Training pay waiver',
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
  properties: {
    waiveTrainingPay,
  },
};
