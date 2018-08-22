import fullConfig from '../config/schema';

const { separationTrainingPay: separationTrainingPaySchema } = fullConfig.properties;

export const uiSchema = {
  separationPay: {
    'ui:title': 'Did you receive separation pay or severance pay?',
    'ui:widget': 'yesNo'
  },
  trainingPay: {
    'ui:title': 'Did you receive active or inactive training pay?',
    'ui:widget': 'yesNo'
  }
};

export const schema = separationTrainingPaySchema;
