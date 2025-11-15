import set from 'platform/utilities/data/set';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { hasMilitaryRetiredPay } from '../validations';
import { getBranches } from '../utils/serviceBranches';

const {
  militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
} = fullSchema.properties;

export const uiSchema = {
  /**
   * Local-only UX field. It mirrors `militaryRetiredPayBranch`:
   *   - no branch ⇔ "no"
   *   - any branch ⇔ "yes"
   *
   * We avoid making this a `view:` field because the confirmation page hides
   * all `view:` fields and we want it visible there. The field is removed
   * before submission upstream.
   */
  hasMilitaryRetiredPay: yesNoUI({
    title: 'Have you ever received military retirement pay?',
  }),
  militaryRetiredPayBranch: {
    'ui:title':
      'Please choose the branch of service that gave you military retired pay ',
    'ui:options': {
      expandUnder: 'hasMilitaryRetiredPay',
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
  required: ['hasMilitaryRetiredPay'],
  properties: {
    hasMilitaryRetiredPay: {
      type: 'boolean',
    },
    militaryRetiredPayBranch: militaryRetiredPayBranchSchema,
  },
};
