import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
import {
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { replaceStrValues } from '../../../utils/helpers/general';
import { validateCurrency } from '../../../utils/validation';
import { LAST_YEAR } from '../../../utils/constants';
import content from '../../../locales/en/content.json';
import DependentExpensesDescription from '../../../components/FormDescriptions/DependentExpensesDescription';

const {
  dependents: { items: dependent },
} = ezrSchema.properties;
const { dependentEducationExpenses } = dependent.properties;

export default {
  uiSchema: {
    attendedSchoolLastYear: yesNoUI(
      replaceStrValues(
        content['household-dependent-attended-school-label'],
        LAST_YEAR,
      ),
    ),
    dependentEducationExpenses: {
      ...currencyUI(content['household-dependent-education-expenses-label']),
      'ui:validations': [validateCurrency],
      'ui:description': DependentExpensesDescription,
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
