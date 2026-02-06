import set from 'platform/utilities/data/set';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';
import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';

import { hasMilitaryRetiredPay } from '../validations';
import { getBranches } from '../utils/serviceBranches';
import ConfirmationRetirementPay from '../components/confirmationFields/ConfirmationRetirementPay';

const {
  militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
} = fullSchema.properties;

const TITLE = 'Retirement pay'; // duplicated from top-level `config/form.js`
const YES_NO_TITLE = 'Have you ever received military retirement pay?';
const BRANCH_TITLE =
  'Please choose the branch of service that gave you military retired pay ';

const ConfirmationField = ConfirmationRetirementPay(
  TITLE,
  YES_NO_TITLE,
  BRANCH_TITLE,
);

export const uiSchema = {
  'view:hasMilitaryRetiredPay': yesNoUI({
    title: YES_NO_TITLE,
  }),
  militaryRetiredPayBranch: {
    'ui:title': BRANCH_TITLE,
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
  'ui:confirmationField': ConfirmationField,
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
