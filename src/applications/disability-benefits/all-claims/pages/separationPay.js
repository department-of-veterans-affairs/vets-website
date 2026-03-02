import fullSchema from 'vets-json-schema/dist/21-526EZ-ALLCLAIMS-schema.json';
import {
  selectUI,
  textUI,
  yesNoUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { isValidYear } from '../validations';
import {
  SEPARATION_PAY_TITLE,
  SEPARATION_PAY_BRANCH_TITLE,
  SEPARATION_PAY_DATE_ERROR,
  SEPARATION_PAY_DATE_TITLE,
  SEPARATION_PAY_SECTION_TITLE,
} from '../constants';
import { separationPayDetailsDescription } from '../content/separationTrainingPay';
import { getBranches } from '../utils/serviceBranches';
import ConfirmationSeparationPay from '../components/confirmationFields/ConfirmationSeparationPay';

const {
  separationPayDate: separationPayDateSchema,
  separationPayBranch: separationPayBranchSchema,
  hasSeparationPay,
} = fullSchema.properties;

export const uiSchema = {
  hasSeparationPay: yesNoUI({
    title: SEPARATION_PAY_TITLE,
  }),
  'view:separationPayDetails': {
    'ui:options': { expandUnder: 'hasSeparationPay' },
    'view:separationPayDetailsDescription': {
      'ui:title': SEPARATION_PAY_SECTION_TITLE,
      'ui:description': separationPayDetailsDescription,
    },
    separationPayDate: textUI({
      title: SEPARATION_PAY_DATE_TITLE,
      width: 'xs',
      validations: [isValidYear],
      errorMessages: { pattern: SEPARATION_PAY_DATE_ERROR },
    }),
    separationPayBranch: selectUI({
      title: SEPARATION_PAY_BRANCH_TITLE,
      updateSchema: (_formData, schema) => {
        if (!schema.enum?.length) {
          const options = getBranches();
          return { ...schema, enum: options };
        }
        return schema;
      },
    }),
  },
  'ui:confirmationField': ConfirmationSeparationPay,
};

export const schema = {
  type: 'object',
  properties: {
    hasSeparationPay,
    'view:separationPayDetails': {
      type: 'object',
      properties: {
        'view:separationPayDetailsDescription': {
          type: 'object',
          properties: {},
        },
        separationPayDate: separationPayDateSchema,
        separationPayBranch: separationPayBranchSchema,
      },
    },
  },
};
