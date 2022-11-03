import set from 'platform/utilities/data/set';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { hasMilitaryRetiredPay } from '../validations';
import { getBranches } from '../utils/serviceBranches';

const {
  militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
} = fullSchema.properties;

export const uiSchema = {
  'view:hasMilitaryRetiredPay': {
    'ui:title': 'Have you ever received military retirement pay?',
    'ui:widget': 'yesNo',
    'ui:options': {},
  },
  militaryRetiredPayBranch: {
    'ui:title':
      'Please choose the branch of service that gave you military retired pay ',
    'ui:options': {
      expandUnder: 'view:hasMilitaryRetiredPay',
      updateSchema: (_formData, schema) => {
        if (!schema.enum?.length) {
          const options = getBranches();
          return set('enum', options, schema);
        }
        return schema;
      },
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
