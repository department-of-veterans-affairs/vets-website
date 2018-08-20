import fullSchema from '../config/schema';

const { servicePay: servicePaySchema } = fullSchema.properties;

export const uiSchema = {
  hasMilitaryRetiredPay: {
    'ui:title': 'Are you receiving military retired pay?',
    'ui:widget': 'yesNo',
    'ui:options': {}
  },
  militaryRetiredPayBranch: {
    'ui:title': 'Please choose the branch of service that gives you military retired pay',
    'ui:options': {
      expandUnder: 'hasMilitaryRetiredPay'
    },
  }
};

export const schema = servicePaySchema;
