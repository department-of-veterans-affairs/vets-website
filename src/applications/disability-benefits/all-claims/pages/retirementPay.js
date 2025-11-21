import set from 'platform/utilities/data/set';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

import { hasMilitaryRetiredPay } from '../validations';
import { getBranches } from '../utils/serviceBranches';
import ConfirmationRetirementPay from '../components/confirmationFields/ConfirmationRetirementPay';

const {
  militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
} = fullSchema.properties;

export const uiSchema = {
  'view:hasMilitaryRetiredPay': yesNoUI({
    title: 'Have you ever received military retirement pay?',
  }),
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
  'ui:confirmationField': ConfirmationRetirementPay,
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
