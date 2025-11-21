import set from 'platform/utilities/data/set';
import { buildPageFields } from 'platform/forms-system/src/js/components/ConfirmationView/ChapterSectionCollection';
import { yesNoUI } from 'platform/forms-system/src/js/web-component-patterns';

import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import { hasMilitaryRetiredPay } from '../validations';
import { getBranches } from '../utils/serviceBranches';

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
  'ui:confirmationField': props =>
    buildPageFields({
      ...props,
      showViewFields: true,
    }),
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
