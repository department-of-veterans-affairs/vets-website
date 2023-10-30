import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { replaceStrValues } from '../../../utils/helpers/general';
import { validateCurrency } from '../../../utils/validation';
import content from '../../../locales/en/content.json';

const {
  dependents: { items: dependent },
} = ezrSchema.properties;
const { dependentEducationExpenses } = dependent.properties;

const date = new Date();
const lastYear = date.getFullYear() - 1;

export default {
  uiSchema: {
    attendedSchoolLastYear: yesNoUI(
      replaceStrValues(
        content['household-dependent-attended-school-label'],
        lastYear,
      ),
    ),
    dependentEducationExpenses: {
      ...currencyUI(content['household-dependent-education-expenses-label']),
      'ui:validations': [validateCurrency],
    },
  },
  schema: {
    type: 'object',
    required: ['dependentEducationExpenses'],
    properties: {
      attendedSchoolLastYear: yesNoSchema,
      dependentEducationExpenses,
    },
  },
};
