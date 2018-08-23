import fullSchema from '../config/schema';
import { trainingPayWaiverDescription } from '../content/trainingPayWaiver';

const { waiveTrainingPay: waiveTrainingPaySchema } = fullSchema.properties;

export const uiSchema = {
  'view:waiveTrainingPayDescription': {
    'ui:title': 'Training pay waiver',
    'ui:description': trainingPayWaiverDescription
  },
  waiveTrainingPay: {
    'ui:title':
      `I choose to waive VA compensation pay for the days I receive inactive 
      duty training pay, so I can keep my inactive duty training pay.`
  }
};

export const schema = {
  type: 'object',
  required: ['waiveTrainingPay'],
  properties: {
    'view:waiveTrainingPayDescription': {
      type: 'object',
      properties: {}
    },
    waiveTrainingPay: waiveTrainingPaySchema
  }
};
