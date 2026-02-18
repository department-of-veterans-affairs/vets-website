import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import {
  arrayBuilderItemFirstPageTitleUI,
  currencyUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import { LAST_YEAR } from '../utils/constants';
import content from '../locales/en/content.json';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
  PreviousFuneralExpenses,
} from '../components/FormDescriptions/ExpensesDescriptions';
import { replaceStrValues } from '../utils/helpers/general';
import { inlineTitleUI } from '../components/FormPatterns/TitlePatterns';

const {
  deductibleMedicalExpenses,
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
} = ezrSchema.properties;

/**
 * Declare schema attributes for deductibles page
 * @returns {PageSchema}
 */
export const DeductibleExpensesPage = () => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `Deductible expenses from ${LAST_YEAR}`,
      description:
        'These deductible expenses will lower the amount of money we count as your income.',
      showEditExplanationText: false,
    }),
    'view:deductibleMedicalExpenses': {
      'ui:title': content['household-expenses-medical-title'],
      'ui:description': MedicalExpensesDescription,
      deductibleMedicalExpenses: currencyUI(
        replaceStrValues(
          content['household-expenses-medical-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:deductibleEducationExpenses': {
      'ui:title': content['household-expenses-education-title'],
      'ui:description': EducationalExpensesDescription,
      deductibleEducationExpenses: currencyUI(
        replaceStrValues(
          content['household-expenses-education-label'],
          LAST_YEAR,
        ),
      ),
    },
    'view:deductibleFuneralExpenses': {
      ...inlineTitleUI(
        content['household-expenses-funeral-title'],
        content['household-expenses-funeral-description'],
      ),
      'ui:description': PreviousFuneralExpenses,
      deductibleFuneralExpenses: currencyUI(
        replaceStrValues(
          content['household-expenses-funeral-label'],
          LAST_YEAR,
        ),
      ),
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:deductibleMedicalExpenses': {
        type: 'object',
        required: ['deductibleMedicalExpenses'],
        properties: { deductibleMedicalExpenses },
      },
      'view:deductibleEducationExpenses': {
        type: 'object',
        required: ['deductibleEducationExpenses'],
        properties: { deductibleEducationExpenses },
      },
      'view:deductibleFuneralExpenses': {
        type: 'object',
        required: ['deductibleFuneralExpenses'],
        properties: { deductibleFuneralExpenses },
      },
    },
  },
});
