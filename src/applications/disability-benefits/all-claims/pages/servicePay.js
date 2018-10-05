import fullSchema from '../config/schema';
import { hasMilitaryRetiredPay } from '../validations';

const {
  militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
} = fullSchema.properties;

export const uiSchema = {
  'view:hasMilitaryRetiredPay': {
    'ui:title': 'Are you receiving military retired pay?',
    'ui:widget': 'yesNo',
    'ui:options': {},
  },
  militaryRetiredPayBranch: {
    'ui:title':
      'Please choose the branch of service that gives you military retired pay',
    'ui:options': {
      expandUnder: 'view:hasMilitaryRetiredPay',
    },
    'ui:required': hasMilitaryRetiredPay,
  },
};

export const schema = {
  type: 'object',
  required: ['view:hasMilitaryRetiredPay'],
  properties: {
    'view:hasMilitaryRetiredPay': {
      type: 'boolean',
    },
    militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
  },
};
