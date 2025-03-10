import {
  // Title,
  // textUI,
  arrayBuilderYesNoUI,
  arrayBuilderYesNoSchema,
  arrayBuilderItemFirstPageTitleUI,
  titleUI,
} from 'platform/forms-system/src/js/web-component-patterns';
import ezrSchema from 'vets-json-schema/dist/10-10EZR-schema.json';
import currencyUI from 'platform/forms-system/src/js/definitions/currency';
// import {
//   PolicyOrGroupTitle,
//   TricarePolicyDescription,
// } from '../components/FormDescriptions';
// import { validatePolicyNumber } from '../utils/validation';
import content from '../locales/en/content.json';
import { replaceStrValues } from '../utils/helpers/general';
import { LAST_YEAR } from '../utils/constants';
import { inlineTitleUI } from '../components/FormPatterns/TitlePatterns';
import {
  GrossIncomeDescription,
  HouseholdFinancialOnboarding,
  OtherIncomeDescription,
  PreviousNetIncome,
} from '../components/FormDescriptions/IncomeDescriptions';
import { validateCurrency } from '../utils/validation';
import {
  EducationalExpensesDescription,
  MedicalExpensesDescription,
  PreviousFuneralExpenses,
} from '../components/FormDescriptions/ExpensesDescriptions';

const {
  veteranGrossIncome,
  veteranNetIncome,
  veteranOtherIncome,
  deductibleMedicalExpenses,
  deductibleEducationExpenses,
  deductibleFuneralExpenses,
  spouseGrossIncome,
  spouseNetIncome,
  spouseOtherIncome,
} = ezrSchema.properties;

/**
 * Declare schema attributes for policy information page
 * @returns {PageSchema}
 */
export const veteranAnnualIncomePage = options => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `Your annual income from ${LAST_YEAR}`,
      nounSingular: options.nounSingular,
    }),
    'view:veteranGrossIncome': {
      ...inlineTitleUI(
        content['household-income-gross-title'],
        content['household-income-gross-description'],
      ),
      'ui:description': GrossIncomeDescription(true),
      veteranGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-gross-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranNetIncome': {
      ...inlineTitleUI(
        content['household-income-net-title'],
        content['household-income-net-description'],
      ),
      'ui:description': PreviousNetIncome(true),
      veteranNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-net-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:veteranOtherIncome': {
      ...inlineTitleUI(
        content['household-income-other-title'],
        content['household-income-other-description'],
      ),
      'ui:description': OtherIncomeDescription(true),
      veteranOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-veteran-income-other-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:veteranGrossIncome': {
        type: 'object',
        required: ['veteranGrossIncome'],
        properties: { veteranGrossIncome },
      },
      'view:veteranNetIncome': {
        type: 'object',
        required: ['veteranNetIncome'],
        properties: { veteranNetIncome },
      },
      'view:veteranOtherIncome': {
        type: 'object',
        required: ['veteranOtherIncome'],
        properties: { veteranOtherIncome },
      },
    },
  },
});

export const deductibleExpensesPage = options => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: `Deductible expenses from ${LAST_YEAR}`,
      description:
        'These deductible expenses will lower the amount of money we count as your income.',
      nounSingular: options.nounSingular,
    }),
    'view:deductibleMedicalExpenses': {
      'ui:title': content['household-expenses-medical-title'],
      'ui:description': MedicalExpensesDescription,
      deductibleMedicalExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-medical-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleEducationExpenses': {
      'ui:title': content['household-expenses-education-title'],
      'ui:description': EducationalExpensesDescription,
      deductibleEducationExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-education-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:deductibleFuneralExpenses': {
      ...inlineTitleUI(
        content['household-expenses-funeral-title'],
        content['household-expenses-funeral-description'],
      ),
      'ui:description': PreviousFuneralExpenses,
      deductibleFuneralExpenses: {
        ...currencyUI(
          replaceStrValues(
            content['household-expenses-funeral-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
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

export const spouseAnnualIncomePage = options => ({
  uiSchema: {
    ...arrayBuilderItemFirstPageTitleUI({
      title: 'annual income',
      nounSingular: options.nounSingular,
    }),
    'view:spouseGrossIncome': {
      ...inlineTitleUI(
        content['household-income-gross-title'],
        content['household-income-gross-description'],
      ),
      'ui:description': GrossIncomeDescription(false),
      spouseGrossIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-spouse-income-gross-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseNetIncome': {
      ...inlineTitleUI(
        content['household-income-net-title'],
        content['household-income-net-description'],
      ),
      'ui:description': PreviousNetIncome(false),
      spouseNetIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-spouse-income-net-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
    'view:spouseOtherIncome': {
      ...inlineTitleUI(
        content['household-income-other-title'],
        content['household-income-other-description'],
      ),
      'ui:description': OtherIncomeDescription(false),
      spouseOtherIncome: {
        ...currencyUI(
          replaceStrValues(
            content['household-spouse-income-other-label'],
            LAST_YEAR,
          ),
        ),
        'ui:validations': [validateCurrency],
      },
    },
  },
  schema: {
    type: 'object',
    properties: {
      'view:spouseGrossIncome': {
        type: 'object',
        required: ['spouseGrossIncome'],
        properties: { spouseGrossIncome },
      },
      'view:spouseNetIncome': {
        type: 'object',
        required: ['spouseNetIncome'],
        properties: { spouseNetIncome },
      },
      'view:spouseOtherIncome': {
        type: 'object',
        required: ['spouseOtherIncome'],
        properties: { spouseOtherIncome },
      },
    },
  },
});

/**
 * Declare schema attributes for summary page
 * @returns {PageSchema}
 */
export const summaryPage = options => ({
  uiSchema: {
    'view:hasFinancialInformationToAdd': arrayBuilderYesNoUI(options, {
      hint: null,
      title: `Do you have any income and deductible to add for ${LAST_YEAR}?`,
    }),
  },

  schema: {
    type: 'object',
    required: ['view:hasFinancialInformationToAdd'],
    properties: {
      'view:hasFinancialInformationToAdd': arrayBuilderYesNoSchema,
    },
  },
});

export const introPage = {
  uiSchema: {
    ...titleUI(
      'Your income and deductible',
      "In the next few questions, we'll ask you about your household financial information.",
    ),
    'ui:description': HouseholdFinancialOnboarding,
  },
  schema: {
    type: 'object',
    properties: {},
  },
};
