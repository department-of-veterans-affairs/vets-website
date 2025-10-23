import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  currencyUI,
  yesNoUI,
  yesNoSchema,
} from 'platform/forms-system/src/js/web-component-patterns';
import { replaceStrValues } from '../../../utils/helpers/general';
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
    dependentEducationExpenses: currencyUI({
      title: content['household-dependent-education-expenses-label'],
      description: DependentExpensesDescription,
    }),
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
